export interface GithubProjectListResponse {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  language: string | null;
  fork: boolean;
}

export interface GithubProjectDetailResponse extends GithubProjectListResponse {
  created_at: string;
  updated_at: string;
  open_issues_count: number;
  watchers_count: number;
  subscribers_count?: number;
}

export type GithubProjectLanguagesResponse = Record<string, number>;

export interface GithubProjectSummary {
  slug: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  primaryLanguage: string | null;
}

export interface GithubProjectDetails extends GithubProjectSummary {
  openIssues: number;
  watchers: number;
  createdAt: string;
  languages: { name: string; share: number }[];
  performance?: GithubProjectPerformance | null;
}

export interface GithubProjectPerformanceVariant {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}

export interface GithubProjectPerformance {
  generatedAt: string | null;
  reportUrl: string | null;
  mobile?: GithubProjectPerformanceVariant;
  desktop?: GithubProjectPerformanceVariant;
}

export interface GithubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string | null;
  html_url: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}
