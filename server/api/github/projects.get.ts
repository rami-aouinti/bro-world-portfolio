import { getMockGithubProjects } from "~/utils/github/mock-projects";
import {
  cacheGithubProjects,
  fetchGithubProjects,
  resolveGithubCredentials,
} from "~/server/utils/github";
import { useRedisClient } from "~/server/utils/redis";

const PROJECTS_CACHE_KEY = "github:projects:list";

export default defineEventHandler(async () => {
  if (import.meta.dev) {
    return getMockGithubProjects();
  }

  const redis = useRedisClient();

  if (redis) {
    try {
      const cachedProjects = await redis.get(PROJECTS_CACHE_KEY);
      if (cachedProjects) {
        return JSON.parse(cachedProjects);
      }
    } catch (error) {
      console.error("[redis] Failed to read projects cache", error);
    }
  }

  const credentials = await resolveGithubCredentials({ includeToken: true });
  const projects = await fetchGithubProjects(credentials.username, credentials.token);

  if (redis) {
    await cacheGithubProjects(projects);
  }

  return projects;
});
