import { createError, getRouterParams } from "h3";
import { getMockGithubProjectDetail } from "~/utils/github/mock-projects";
import {
  cacheGithubProjectDetail,
  fetchGithubProjectDetail,
  resolveGithubCredentials,
} from "~/server/utils/github";
import { useRedisClient } from "~/server/utils/redis";

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing repository name" });
  }

  if (import.meta.dev) {
    const mockProject = getMockGithubProjectDetail(slug);
    if (mockProject) {
      return mockProject;
    }

    throw createError({ statusCode: 404, statusMessage: "Repository not found" });
  }

  const redis = useRedisClient();
  const cacheKey = `github:projects:detail:${slug}`;

  if (redis) {
    try {
      const cachedProject = await redis.get(cacheKey);
      if (cachedProject) {
        return JSON.parse(cachedProject);
      }
    } catch (error) {
      console.error("[redis] Failed to read project detail cache", error);
    }
  }

  const credentials = await resolveGithubCredentials({ includeToken: true });
  const projectDetail = await fetchGithubProjectDetail(
    credentials.username,
    slug,
    credentials.token,
  );

  if (redis) {
    await cacheGithubProjectDetail(slug, projectDetail);
  }

  return projectDetail;
});
