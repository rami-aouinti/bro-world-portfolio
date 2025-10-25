import { createError, getRouterParams } from "h3";
import type { GithubProjectDetailResponse, GithubProjectLanguagesResponse } from "~/types/github";
import { getMockGithubProjectDetail } from "~/utils/github/mock-projects";

const API_BASE_URL = "https://api.github.com";

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

  let repo: GithubProjectDetailResponse;

  try {
    repo = await $fetch<GithubProjectDetailResponse>(`${API_BASE_URL}/repos/${username}/${slug}`, { headers });
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: "Repository not found" });
  }

  const languagesResponse = await $fetch<GithubProjectLanguagesResponse>(
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
  };
});
