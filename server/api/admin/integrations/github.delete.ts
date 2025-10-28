import { defineEventHandler } from "h3";

import { disconnectGithubIntegration } from "~/server/utils/github";
import { assertCsrf, requireAdminSession } from "~/server/utils/session";

export default defineEventHandler(async (event) => {
  await assertCsrf(event);
  await requireAdminSession(event);

  await disconnectGithubIntegration();

  return {
    connected: false,
    username: null,
    hasToken: false,
    source: "integration" as const,
    profile: null,
    projects: [],
    connectedAt: null,
    lastSyncError: null,
  };
});
