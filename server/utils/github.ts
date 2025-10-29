import { createError } from "h3";
import { useRuntimeConfig } from "#imports";

import type {
  GithubProjectDetailResponse,
  GithubProjectDetails,
  GithubProjectListResponse,
  GithubProjectSummary,
  GithubUserProfile,
} from "~/types/github";
import type { AdminGithubProfile } from "~/types/integrations";
import { deleteIntegrationSetting, getIntegrationSetting, setIntegrationSetting } from "./integration-settings";
import { getRedisCacheTtl, useRedisClient } from "./redis";
import { getProjectPerformance } from "~/utils/projects/performance";

const API_BASE_URL = "https://api.github.com";
const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "bro-world-portfolio",
  "X-GitHub-Api-Version": "2022-11-28",
};

export interface GithubCredentials {
  username: string;
  token?: string;
  source: "integration" | "config";
}

export interface GithubIntegrationState {
  connected: boolean;
  username: string | null;
  hasToken: boolean;
}

export async function resolveGithubCredentials(options: { includeToken?: boolean } = {}) {
  const config = useRuntimeConfig();
  const usernameSetting = await getIntegrationSetting("github", "username");
  const tokenSetting = await getIntegrationSetting("github", "token");

  const usernameFromIntegration = usernameSetting?.value?.trim();
  const tokenFromIntegration = tokenSetting?.value?.trim();

  const username =
    usernameFromIntegration || config.public?.githubUsername || "rami-aouinti";
  const token = tokenFromIntegration || (config.githubToken as string | undefined);

  return {
    username,
    token: options.includeToken ? token : undefined,
    hasToken: Boolean(token),
    source: usernameFromIntegration || tokenFromIntegration ? "integration" : "config",
  } satisfies GithubCredentials & { hasToken: boolean };
}

export function buildGithubHeaders(token?: string) {
  const headers = { ...DEFAULT_HEADERS } as HeadersInit;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function mapGithubProfile(profile: GithubUserProfile): AdminGithubProfile {
  return {
    login: profile.login,
    name: profile.name ?? null,
    avatarUrl: profile.avatar_url ?? null,
    htmlUrl: profile.html_url,
    bio: profile.bio ?? null,
    blog: profile.blog ?? null,
    company: profile.company ?? null,
    location: profile.location ?? null,
    followers: profile.followers,
    following: profile.following,
    publicRepos: profile.public_repos,
  };
}

export async function fetchGithubProjects(
  username: string,
  token?: string,
): Promise<GithubProjectSummary[]> {
  const headers = buildGithubHeaders(token);
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

  return repos
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
}

export async function fetchGithubProjectDetail(
  username: string,
  slug: string,
  token?: string,
): Promise<GithubProjectDetails> {
  const headers = buildGithubHeaders(token);

  let repo: GithubProjectDetailResponse;

  try {
    repo = await $fetch<GithubProjectDetailResponse>(`${API_BASE_URL}/repos/${username}/${slug}`, {
      headers,
    });
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: "Repository not found" });
  }

  const languagesResponse = await $fetch<Record<string, number>>(
    `${API_BASE_URL}/repos/${username}/${slug}/languages`,
    { headers },
  );

  const totalBytes = Object.values(languagesResponse).reduce((sum, value) => sum + value, 0);
  const languages = Object.entries(languagesResponse)
    .map(([name, value]) => ({
      name,
      share: totalBytes ? Math.round((value / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.share - a.share);

  const performance = getProjectPerformance(slug);

  return {
    slug: repo.name,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    watchers: repo.subscribers_count ?? repo.watchers_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    primaryLanguage: repo.language,
    languages,
    performance: performance ?? null,
  };
}

export async function fetchGithubProfile(username: string, token?: string) {
  const headers = buildGithubHeaders(token);
  const profile = await $fetch<GithubUserProfile>(`${API_BASE_URL}/users/${username}`, {
    headers,
  });
  return profile;
}

export async function clearGithubCaches(slug?: string) {
  const redis = useRedisClient();
  if (!redis) {
    return;
  }

  const keys = ["github:projects:list"];
  if (slug) {
    keys.push(`github:projects:detail:${slug}`);
  }

  await Promise.all(
    keys.map(async (key) => {
      try {
        await redis.del(key);
      } catch (error) {
        console.error(`[redis] Failed to delete cache for ${key}`, error);
      }
    }),
  );
}

export async function disconnectGithubIntegration() {
  await Promise.all([
    deleteIntegrationSetting("github", "username"),
    deleteIntegrationSetting("github", "token"),
    deleteIntegrationSetting("github", "connectedAt"),
  ]);
  await clearGithubCaches();
}

export async function connectGithubIntegration(username: string, token: string) {
  if (!username.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Le nom d’utilisateur GitHub est requis." });
  }

  if (!token.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Le token d’accès GitHub est requis." });
  }

  const headers = buildGithubHeaders(token);

  try {
    await $fetch(`${API_BASE_URL}/user`, { headers });
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Le token GitHub est invalide." });
  }

  await Promise.all([
    setIntegrationSetting("github", "username", username.trim(), { isSecret: false }),
    setIntegrationSetting("github", "token", token.trim(), { isSecret: true }),
    setIntegrationSetting("github", "connectedAt", new Date().toISOString()),
  ]);

  await clearGithubCaches();
}

export async function cacheGithubProjects(projects: GithubProjectSummary[]) {
  const redis = useRedisClient();
  const cacheTtl = getRedisCacheTtl();

  if (!redis) {
    return;
  }

  try {
    await redis.set("github:projects:list", JSON.stringify(projects), "EX", cacheTtl);
  } catch (error) {
    console.error("[redis] Failed to write projects cache", error);
  }
}

export async function cacheGithubProjectDetail(slug: string, project: GithubProjectDetails) {
  const redis = useRedisClient();
  const cacheTtl = getRedisCacheTtl();

  if (!redis) {
    return;
  }

  try {
    await redis.set(`github:projects:detail:${slug}`, JSON.stringify(project), "EX", cacheTtl);
  } catch (error) {
    console.error("[redis] Failed to write project detail cache", error);
  }
}
