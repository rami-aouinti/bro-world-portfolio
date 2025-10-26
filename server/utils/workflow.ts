import { $fetch } from "ofetch";
import { useNitroApp } from "#imports";

export interface WorkflowRuntimeConfig {
  workflow?: {
    apiKey?: string;
    baseUrl?: string;
    timeoutMs?: number | string;
  };
}

export interface WorkflowRequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface WorkflowClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeoutMs: number;
  request<T = unknown>(path: string, options?: WorkflowRequestOptions): Promise<T>;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function normalizeTimeout(timeout: unknown): number {
  if (typeof timeout === "number" && Number.isFinite(timeout) && timeout > 0) {
    return timeout;
  }

  if (typeof timeout === "string") {
    const parsed = Number.parseInt(timeout, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return DEFAULT_TIMEOUT_MS;
}

function ensureAbsolutePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function createWorkflowClient(config: WorkflowRuntimeConfig): WorkflowClient {
  const apiKey = typeof config.workflow?.apiKey === "string" ? config.workflow.apiKey.trim() : "";
  if (!apiKey) {
    throw new Error("Workflow API key is missing from the runtime configuration.");
  }

  const baseUrl = typeof config.workflow?.baseUrl === "string" ? config.workflow.baseUrl.trim().replace(/\/+$/, "") : "";
  if (!baseUrl) {
    throw new Error("Workflow base URL is missing from the runtime configuration.");
  }

  const timeoutMs = normalizeTimeout(config.workflow?.timeoutMs);

  return {
    apiKey,
    baseUrl,
    timeoutMs,
    async request<T>(path: string, options: WorkflowRequestOptions = {}) {
      const url = `${baseUrl}${ensureAbsolutePath(path)}`;
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        ...(options.headers ?? {}),
      };

      return await $fetch<T>(url, {
        method: options.method ?? "GET",
        body: options.body,
        query: options.query,
        headers,
        timeout: timeoutMs,
      });
    },
  };
}

export function useWorkflowClient(): WorkflowClient {
  const nitroApp = useNitroApp();
  const client = nitroApp.locals.workflow;
  if (!client) {
    throw new Error("Workflow client has not been initialized.");
  }
  return client;
}
