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
