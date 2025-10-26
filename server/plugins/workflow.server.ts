import { defineNitroPlugin, useRuntimeConfig } from "#imports";
import { createWorkflowClient } from "../utils/workflow";

export default defineNitroPlugin((nitroApp) => {
  const logger = nitroApp.logger ?? console;

  logger.info("[workflow] Initializing workflow client");

  try {
    const runtimeConfig = useRuntimeConfig();
    const client = createWorkflowClient(runtimeConfig);

    nitroApp.locals.workflow = client;

    logger.info("[workflow] Workflow client initialized successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[workflow] Failed to initialize workflow client: ${message}`);
    if (error instanceof Error) {
      logger.error(error);
    }
    throw error;
  }
});
