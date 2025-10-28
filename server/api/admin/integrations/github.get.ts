import { defineEventHandler } from "h3";

import {
  fetchGithubProfile,
  fetchGithubProjects,
  mapGithubProfile,
  resolveGithubCredentials,
} from "~/server/utils/github";
import { getIntegrationSetting } from "~/server/utils/integration-settings";
import { requireAdminSession } from "~/server/utils/session";
import type { AdminGithubIntegrationState, AdminGithubProfile } from "~/types/integrations";

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const credentials = await resolveGithubCredentials({ includeToken: true });
  const connectedAtSetting = await getIntegrationSetting("github", "connectedAt");
  const isConnectedViaIntegration = credentials.source === "integration" && credentials.hasToken;

  let profile: AdminGithubProfile | null = null;
  let projects = [] as Awaited<ReturnType<typeof fetchGithubProjects>>;
  let lastSyncError: string | null = null;

  if (credentials.username && credentials.hasToken) {
    try {
      const rawProfile = await fetchGithubProfile(credentials.username, credentials.token);
      profile = mapGithubProfile(rawProfile);
    } catch (error: unknown) {
      console.error("[github] Failed to fetch profile", error);
      lastSyncError = "Impossible de récupérer le profil GitHub.";
    }

    try {
      projects = await fetchGithubProjects(credentials.username, credentials.token);
    } catch (error: unknown) {
      console.error("[github] Failed to fetch repositories", error);
      lastSyncError = "Impossible de récupérer les projets GitHub.";
    }
  }

  const state: AdminGithubIntegrationState = {
    connected: isConnectedViaIntegration,
    username: credentials.username ?? null,
    hasToken: credentials.hasToken,
    source: credentials.source,
    profile: profile && isConnectedViaIntegration ? profile : null,
    projects: isConnectedViaIntegration ? projects : [],
    connectedAt: connectedAtSetting?.value ?? null,
    lastSyncError,
  };

  return state;
});
