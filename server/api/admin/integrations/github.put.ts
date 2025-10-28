import { defineEventHandler, readBody } from "h3";
import { z } from "zod";

import {
  connectGithubIntegration,
  fetchGithubProfile,
  fetchGithubProjects,
  mapGithubProfile,
  resolveGithubCredentials,
} from "~/server/utils/github";
import { getIntegrationSetting } from "~/server/utils/integration-settings";
import { assertCsrf, requireAdminSession } from "~/server/utils/session";
import type { AdminGithubIntegrationState } from "~/types/integrations";

const connectSchema = z.object({
  username: z.string().trim().min(1, "Le nom d’utilisateur est requis."),
  token: z.string().trim().min(1, "Le token d’accès est requis."),
});

export default defineEventHandler(async (event) => {
  await assertCsrf(event);
  await requireAdminSession(event);

  const payload = await readBody(event);
  const { username, token } = connectSchema.parse(payload);

  await connectGithubIntegration(username, token);

  const credentials = await resolveGithubCredentials({ includeToken: true });
  const [connectedAtSetting, rawProfile, projects] = await Promise.all([
    getIntegrationSetting("github", "connectedAt"),
    fetchGithubProfile(credentials.username, credentials.token),
    fetchGithubProjects(credentials.username, credentials.token),
  ]);

  const state: AdminGithubIntegrationState = {
    connected: true,
    username: credentials.username,
    hasToken: true,
    source: "integration",
    profile: mapGithubProfile(rawProfile),
    projects,
    connectedAt: connectedAtSetting?.value ?? new Date().toISOString(),
    lastSyncError: null,
  };

  return state;
});
