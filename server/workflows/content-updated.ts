import { randomUUID } from "node:crypto";
import { z } from "zod";
import { useRuntimeConfig } from "#imports";

/**
 * Minimal workflow SDK helpers. In a real setup these would come from the official package,
 * but we provide lightweight equivalents so the workflow can be described and triggered.
 */

export interface WorkflowStepContext<Input> {
  input: Input;
  runId: string;
  workflow: WorkflowDefinition<Input>;
  logger: Console;
}

export interface WorkflowStep<Input> {
  id: string;
  name?: string;
  description?: string;
  run: (context: WorkflowStepContext<Input>) => Promise<void> | void;
}

export interface WorkflowDefinition<Input> {
  slug: string;
  name: string;
  version: string;
  inputSchema: z.ZodType<Input>;
  steps: WorkflowStep<Input>[];
}

interface WorkflowHelpers<Input> {
  step: (step: WorkflowStep<Input>) => WorkflowStep<Input>;
}

type StepsFactory<Input> = (helpers: WorkflowHelpers<Input>) =>
  | WorkflowStep<Input>[]
  | Record<string, WorkflowStep<Input>>
  | void;

export function defineWorkflow<InputSchema extends z.ZodTypeAny>(options: {
  slug: string;
  name?: string;
  version?: string;
  inputSchema: InputSchema;
  steps: StepsFactory<z.infer<InputSchema>>;
}): WorkflowDefinition<z.infer<InputSchema>> {
  const { slug, name = slug, version = "v1", inputSchema, steps } = options;
  const helpers: WorkflowHelpers<z.infer<InputSchema>> = {
    step: (step) => step,
  };

  const definedSteps = steps(helpers);
  let stepsArray: WorkflowStep<z.infer<InputSchema>>[] = [];

  if (Array.isArray(definedSteps)) {
    stepsArray = definedSteps;
  } else if (definedSteps && typeof definedSteps === "object") {
    stepsArray = Object.values(definedSteps);
  }

  return {
    slug,
    name,
    version,
    inputSchema,
    steps: stepsArray,
  };
}

interface WorkflowClientOptions {
  endpoint?: string | null;
  apiKey?: string | null;
  fetchImplementation?: typeof fetch;
}

interface TriggerOptions<Input> {
  workflow: WorkflowDefinition<Input>;
  payload: Input;
}

interface TriggerResult {
  runId: string;
  skipped: boolean;
  response?: unknown;
}

class WorkflowClient {
  private readonly endpoint?: string;
  private readonly apiKey?: string;
  private readonly fetchImplementation: typeof fetch;

  constructor({ endpoint, apiKey, fetchImplementation }: WorkflowClientOptions) {
    this.endpoint = typeof endpoint === "string" ? endpoint.trim() : undefined;
    this.apiKey = typeof apiKey === "string" ? apiKey.trim() : undefined;
    this.fetchImplementation = fetchImplementation ?? globalThis.fetch;
  }

  async trigger<Input>({ workflow, payload }: TriggerOptions<Input>): Promise<TriggerResult> {
    const runId = randomUUID();

    if (!this.endpoint || !this.apiKey) {
      console.info(
        `[workflow] Trigger skipped for "${workflow.slug}" (missing endpoint or API key)`,
        { runId, payload }
      );

      return { runId, skipped: true };
    }

    if (typeof this.fetchImplementation !== "function") {
      console.warn(
        `[workflow] Trigger skipped for "${workflow.slug}" (fetch implementation unavailable)`,
        { runId }
      );

      return { runId, skipped: true };
    }

    const requestBody = {
      workflow: {
        slug: workflow.slug,
        version: workflow.version,
      },
      payload,
    };

    try {
      const endpointUrl = new URL(
        `/workflows/${workflow.slug}/trigger`,
        this.endpoint.endsWith("/") ? this.endpoint : `${this.endpoint}/`
      );

      const response = await this.fetchImplementation(endpointUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
          `Unexpected response (${response.status} ${response.statusText})${
            errorBody ? ` – ${errorBody}` : ""
          }`
        );
      }

      const data = await response
        .json()
        .catch(() => ({ runId: undefined as string | undefined }));
      const remoteRunId = typeof data?.runId === "string" && data.runId.length > 0 ? data.runId : runId;

      console.info(`[workflow] Triggered "${workflow.slug}"`, { runId: remoteRunId });

      return {
        runId: remoteRunId,
        skipped: false,
        response: data,
      };
    } catch (error) {
      console.error(`[workflow] Failed to trigger "${workflow.slug}"`, error);
      return { runId, skipped: true };
    }
  }
}

function getWorkflowRuntimeConfig(): { endpoint?: string; apiKey?: string } {
  try {
    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig?.workflow) {
      return runtimeConfig.workflow as { endpoint?: string; apiKey?: string };
    }
  } catch {
    // Ignore – this can happen when called outside of a Nitro context (e.g. during build-time).
  }

  return {
    endpoint: process.env.WORKFLOW_ENDPOINT,
    apiKey: process.env.WORKFLOW_API_KEY,
  };
}

let cachedClient: WorkflowClient | null = null;

function useWorkflowClient(): WorkflowClient {
  if (cachedClient) {
    return cachedClient;
  }

  const { endpoint, apiKey } = getWorkflowRuntimeConfig();
  cachedClient = new WorkflowClient({ endpoint, apiKey });
  return cachedClient;
}

export const ContentUpdatedPayloadSchema = z.object({
  id: z.string().min(1, "A content identifier is required."),
  type: z.string().min(1, "A content type is required."),
  slug: z.string().min(1).optional(),
  locale: z.string().min(2).default("en"),
  operation: z.enum(["created", "updated", "deleted"]).default("updated"),
  paths: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).optional(),
  changedAt: z.string().datetime().optional(),
  actor: z
    .object({
      id: z.string().min(1).optional(),
      email: z.string().email().optional(),
      name: z.string().min(1).optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ContentUpdatedPayload = z.infer<typeof ContentUpdatedPayloadSchema>;

export const contentUpdatedWorkflow = defineWorkflow({
  slug: "content-updated",
  name: "Content updated",
  version: "v1",
  inputSchema: ContentUpdatedPayloadSchema,
  steps: ({ step }) => [
    step({
      id: "revalidate-pages",
      name: "Revalidate affected routes",
      description:
        "Invalidate static caches or trigger ISR revalidation for routes touched by the content change.",
      run: async ({ input, logger, runId, workflow }) => {
        logger.info(
          `[workflow:${workflow.slug}] (${runId}) Revalidating impacted routes`,
          input.paths
        );
        // TODO: Integrate with the application revalidation endpoint (e.g. call $fetch('/api/revalidate')).
      },
    }),
    step({
      id: "notify-subscribers",
      name: "Notify subscribers",
      description: "Send notifications to subscribers or downstream services about the change.",
      run: async ({ input, logger, runId, workflow }) => {
        logger.info(
          `[workflow:${workflow.slug}] (${runId}) Dispatching notifications`,
          {
            id: input.id,
            type: input.type,
            operation: input.operation,
          }
        );
        // TODO: Publish a message to the notification system (e.g. email, webhooks, Slack).
      },
    }),
    step({
      id: "refresh-search-index",
      name: "Refresh search index",
      description: "Ensure search backends pick up the updated content metadata.",
      run: async ({ input, logger, runId, workflow }) => {
        logger.info(
          `[workflow:${workflow.slug}] (${runId}) Scheduling search index refresh`,
          {
            id: input.id,
            tags: input.tags,
          }
        );
        // TODO: Queue a background job that reindexes the updated content.
      },
    }),
  ],
});

export async function triggerContentUpdated(payload: ContentUpdatedPayload): Promise<string> {
  const parsedPayload = contentUpdatedWorkflow.inputSchema.parse(payload);
  const client = useWorkflowClient();
  const result = await client.trigger({ workflow: contentUpdatedWorkflow, payload: parsedPayload });

  console.info(`[workflow] Content updated workflow queued`, {
    runId: result.runId,
    skipped: result.skipped,
    slug: contentUpdatedWorkflow.slug,
  });

  return result.runId;
}
