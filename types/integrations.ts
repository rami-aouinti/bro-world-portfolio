import type { GithubProjectSummary } from "./github";

export interface AdminGithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string | null;
  htmlUrl: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  location: string | null;
  followers: number;
  following: number;
  publicRepos: number;
}

export interface AdminGithubIntegrationState {
  connected: boolean;
  username: string | null;
  hasToken: boolean;
  source: "integration" | "config";
  profile: AdminGithubProfile | null;
  projects: GithubProjectSummary[];
  connectedAt: string | null;
  lastSyncError?: string | null;
}

export interface AdminLinkedinProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  profileUrl: string | null;
  avatarUrl: string | null;
}

export interface AdminLinkedinExperience {
  slug: string;
  role: string;
  company: string;
  timeframe: string;
  achievements: string[];
}

export interface AdminLinkedinEducation {
  slug: string;
  degree: string;
  institution: string;
  timeframe: string;
  details: string;
}

export interface AdminLinkedinIntegrationState {
  connected: boolean;
  locale: string;
  profile: AdminLinkedinProfile | null;
  experiences: AdminLinkedinExperience[];
  education: AdminLinkedinEducation[];
  lastSyncedAt: string | null;
  lastSyncError?: string | null;
  connectedAt?: string | null;
}
