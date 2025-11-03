import { resolveApiFetcher } from "~/lib/api/fetcher";

export interface PlatformResumeRecord {
  id: string;
  userId: string;
  fullName: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  avatarUrl: string | null;
  updatedAt: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface PlatformResumeExperience {
  id: string;
  resumeId: string;
  company: string | null;
  role: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent?: boolean;
  position?: number | null;
  location?: string | null;
  description?: string | null;
  [key: string]: unknown;
}

export interface PlatformResumeEducation {
  id: string;
  resumeId: string;
  institution: string | null;
  degree: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  position?: number | null;
  [key: string]: unknown;
}

export interface PlatformResumeSkill {
  id: string;
  resumeId: string;
  name: string;
  level?: string | null;
  category?: string | null;
  position?: number | null;
  [key: string]: unknown;
}

export interface PlatformResumeLanguage {
  id: string;
  resumeId: string;
  name: string;
  proficiency?: string | number | null;
  position?: number | null;
  [key: string]: unknown;
}

export interface PlatformResumeHobby {
  id: string;
  resumeId: string;
  name: string;
  description?: string | null;
  position?: number | null;
  [key: string]: unknown;
}

export interface PlatformResumeProject {
  id: string;
  resumeId: string;
  name: string;
  description?: string | null;
  link?: string | null;
  position?: number | null;
  [key: string]: unknown;
}

export interface PlatformResumeEnvelope {
  resume: PlatformResumeRecord | null;
  experiences: PlatformResumeExperience[];
  education: PlatformResumeEducation[];
  skills: PlatformResumeSkill[];
  languages: PlatformResumeLanguage[];
  hobbies: PlatformResumeHobby[];
  projects: PlatformResumeProject[];
  [key: string]: unknown;
}

export type PlatformResumeResourceName =
  | "experience"
  | "education"
  | "skill"
  | "language"
  | "hobby"
  | "project";

type ResourcePayload = Record<string, unknown>;

interface ResourceClient {
  create<T = ResourcePayload, R = ResourcePayload>(payload: T): Promise<R>;
  update<T = ResourcePayload, R = ResourcePayload>(id: string, payload: T): Promise<R>;
  remove(id: string): Promise<void>;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

function resourcePath(resource: PlatformResumeResourceName, action: "create"): string;
function resourcePath(
  resource: PlatformResumeResourceName,
  action: "update" | "delete",
  id: string,
): string;
function resourcePath(
  resource: PlatformResumeResourceName,
  action: "create" | "update" | "delete",
  id?: string,
): string {
  const normalized = resource.toLowerCase();
  switch (action) {
    case "create":
      return `/platform/resume/${normalized}/create`;
    case "update":
      return `/platform/resume/${normalized}/${id}/update`;
    case "delete":
      return `/platform/resume/${normalized}/${id}/delete`;
    default:
      return `/platform/resume/${normalized}`;
  }
}

function createResourceClient(resource: PlatformResumeResourceName): ResourceClient {
  const fetcher = resolveApiFetcher();

  return {
    async create<T = ResourcePayload, R = ResourcePayload>(payload: T) {
      return fetcher<R>(resourcePath(resource, "create"), {
        method: "POST",
        data: payload,
        headers: jsonHeaders,
        context: { isPrivate: true },
      });
    },
    async update<T = ResourcePayload, R = ResourcePayload>(id: string, payload: T) {
      return fetcher<R>(resourcePath(resource, "update", id), {
        method: "PUT",
        data: payload,
        headers: jsonHeaders,
        context: { isPrivate: true },
      });
    },
    async remove(id: string) {
      await fetcher(resourcePath(resource, "delete", id), {
        method: "DELETE",
        context: { isPrivate: true },
      });
    },
  };
}

export function resolvePlatformResumeFetcher() {
  const fetcher = resolveApiFetcher();

  return {
    async fetchEnvelope(): Promise<PlatformResumeEnvelope> {
      return fetcher<PlatformResumeEnvelope>("/platform/resume", {
        method: "GET",
        context: { isPrivate: true },
      });
    },
    resources: {
      experience: createResourceClient("experience"),
      education: createResourceClient("education"),
      skill: createResourceClient("skill"),
      language: createResourceClient("language"),
      hobby: createResourceClient("hobby"),
      project: createResourceClient("project"),
    },
  };
}
