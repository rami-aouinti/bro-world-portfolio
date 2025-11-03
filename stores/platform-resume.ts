import { computed, ref } from "vue";
import { defineStore } from "~/lib/pinia-shim";
import {
  resolvePlatformResumeFetcher,
  type PlatformResumeExperience,
  type PlatformResumeEducation,
  type PlatformResumeHobby,
  type PlatformResumeLanguage,
  type PlatformResumeProject,
  type PlatformResumeRecord,
  type PlatformResumeResourceName,
  type PlatformResumeSkill,
} from "~/lib/resume/platform-client";

type ResourceCollectionMap = {
  experience: PlatformResumeExperience[];
  education: PlatformResumeEducation[];
  skill: PlatformResumeSkill[];
  language: PlatformResumeLanguage[];
  hobby: PlatformResumeHobby[];
  project: PlatformResumeProject[];
};

type ResourceCollections = {
  [Key in keyof ResourceCollectionMap]: ResourceCollectionMap[Key];
};

type ResourceEntity<Key extends PlatformResumeResourceName> = ResourceCollectionMap[Key][number];

function resolveErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const withMessage = error as { message?: unknown };
    if (typeof withMessage.message === "string" && withMessage.message.trim()) {
      return withMessage.message;
    }

    const maybeResponse = error as { response?: { data?: { message?: unknown } } };
    const responseMessage = maybeResponse.response?.data?.message;
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Une erreur est survenue lors de la récupération des données du CV.";
}

export const usePlatformResumeStore = defineStore("platform-resume", () => {
  const resume = ref<PlatformResumeRecord | null>(null);
  const collections = ref<ResourceCollections>({
    experience: [],
    education: [],
    skill: [],
    language: [],
    hobby: [],
    project: [],
  });

  const loadingState = ref(false);
  const loadedState = ref(false);
  const errorState = ref<string | null>(null);

  const fetcher = resolvePlatformResumeFetcher();

  function setCollection<Key extends PlatformResumeResourceName>(
    key: Key,
    items: ResourceCollectionMap[Key],
  ) {
    collections.value[key] = items;
  }

  function upsertEntry<Key extends PlatformResumeResourceName>(
    key: Key,
    entry: ResourceEntity<Key>,
  ) {
    const list = [...collections.value[key]] as ResourceCollectionMap[Key];
    const index = list.findIndex((item) => item.id === entry.id);

    if (index === -1) {
      list.unshift(entry);
    } else {
      list[index] = entry;
    }

    collections.value[key] = list;
  }

  function removeEntry<Key extends PlatformResumeResourceName>(key: Key, id: string) {
    const list = collections.value[key].filter((item) => item.id !== id) as ResourceCollectionMap[Key];
    collections.value[key] = list;
  }

  async function fetchResume(force = false) {
    if (loadingState.value) {
      return;
    }

    if (loadedState.value && !force) {
      return;
    }

    loadingState.value = true;
    errorState.value = null;

    try {
      const envelope = await fetcher.fetchEnvelope();
      resume.value = envelope.resume ?? null;
      setCollection("experience", envelope.experiences ?? []);
      setCollection("education", envelope.education ?? []);
      setCollection("skill", envelope.skills ?? []);
      setCollection("language", envelope.languages ?? []);
      setCollection("hobby", envelope.hobbies ?? []);
      setCollection("project", envelope.projects ?? []);
      loadedState.value = true;
    } catch (error) {
      errorState.value = resolveErrorMessage(error);
      throw error;
    } finally {
      loadingState.value = false;
    }
  }

  async function reload() {
    loadedState.value = false;
    await fetchResume(true);
  }

  async function createResource<Key extends PlatformResumeResourceName, Payload extends Record<string, unknown>>(
    key: Key,
    payload: Payload,
  ) {
    try {
      const result = await fetcher.resources[key].create(payload);
      upsertEntry(key, result as ResourceEntity<Key>);
      return result as ResourceEntity<Key>;
    } catch (error) {
      errorState.value = resolveErrorMessage(error);
      throw error;
    }
  }

  async function updateResource<Key extends PlatformResumeResourceName, Payload extends Record<string, unknown>>(
    key: Key,
    id: string,
    payload: Payload,
  ) {
    try {
      const result = await fetcher.resources[key].update(id, payload);
      upsertEntry(key, result as ResourceEntity<Key>);
      return result as ResourceEntity<Key>;
    } catch (error) {
      errorState.value = resolveErrorMessage(error);
      throw error;
    }
  }

  async function deleteResource<Key extends PlatformResumeResourceName>(key: Key, id: string) {
    try {
      await fetcher.resources[key].remove(id);
      removeEntry(key, id);
    } catch (error) {
      errorState.value = resolveErrorMessage(error);
      throw error;
    }
  }

  function buildDefaultPayload(key: PlatformResumeResourceName): Record<string, unknown> {
    const resumeId = resume.value?.id ?? "";
    const basePosition = collections.value[key].length + 1;

    switch (key) {
      case "experience":
        return {
          resumeId,
          company: "Entreprise",
          role: "Poste",
          startDate: new Date().getFullYear().toString(),
          endDate: null,
          isCurrent: true,
          position: basePosition,
          location: null,
          description: null,
        } satisfies Partial<PlatformResumeExperience>;
      case "education":
        return {
          resumeId,
          institution: "Établissement",
          degree: "Diplôme",
          startDate: new Date().getFullYear().toString(),
          endDate: null,
          location: null,
          description: null,
          position: basePosition,
        } satisfies Partial<PlatformResumeEducation>;
      case "skill":
        return {
          resumeId,
          name: "Compétence",
          level: "",
          category: "",
          position: basePosition,
        } satisfies Partial<PlatformResumeSkill>;
      case "language":
        return {
          resumeId,
          name: "Langue",
          proficiency: "",
          position: basePosition,
        } satisfies Partial<PlatformResumeLanguage>;
      case "hobby":
        return {
          resumeId,
          name: "Centre d'intérêt",
          description: "",
          position: basePosition,
        } satisfies Partial<PlatformResumeHobby>;
      case "project":
        return {
          resumeId,
          name: "Projet",
          description: "",
          link: "",
          position: basePosition,
        } satisfies Partial<PlatformResumeProject>;
      default:
        return { resumeId };
    }
  }

  const isLoading = computed(() => loadingState.value);
  const isLoaded = computed(() => loadedState.value);
  const error = computed(() => errorState.value);
  const experiences = computed(() => collections.value.experience);
  const education = computed(() => collections.value.education);
  const skills = computed(() => collections.value.skill);
  const languages = computed(() => collections.value.language);
  const hobbies = computed(() => collections.value.hobby);
  const projects = computed(() => collections.value.project);

  return {
    resume,
    experiences,
    education,
    skills,
    languages,
    hobbies,
    projects,
    isLoading,
    isLoaded,
    error,
    fetchResume,
    reload,
    createResource,
    updateResource,
    deleteResource,
    buildDefaultPayload,
  };
});
