import type { GithubProjectListResponse } from "~/types/github";
import { getMockGithubProjects } from "~/utils/github/mock-projects";
import { getRedisCacheTtl, useRedisClient } from "~/server/utils/redis";

const API_BASE_URL = "https://api.github.com";
const PROJECTS_CACHE_KEY = "github:projects:list";

export default defineEventHandler(async () => {
  if (import.meta.dev) {
    return getMockGithubProjects();
  }

  const redis = useRedisClient();
  const cacheTtl = getRedisCacheTtl();

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

  const config = useRuntimeConfig();
  const username = config.public?.githubUsername ?? "rami-aouinti";
  const token = config.githubToken as string | undefined;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "bro-world-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const repos = await $fetch<GithubProjectListResponse[]>(
    `${API_BASE_URL}/users/${username}/repos`,
    {
      headers,
      query: {
        per_page: 100,
        sort: "updated",
        direction: "desc",
      },
    },
  );

  const projects = repos
    .filter((repo) => !repo.fork && repo.description && repo.description.trim().length > 0)
    .map((repo) => ({
      slug: repo.name,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.pushed_at,
      primaryLanguage: repo.language,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (redis) {
    try {
      await redis.set(PROJECTS_CACHE_KEY, JSON.stringify(projects), "EX", cacheTtl);
    } catch (error) {
      console.error("[redis] Failed to write projects cache", error);
    }
  }

  return projects;
});
