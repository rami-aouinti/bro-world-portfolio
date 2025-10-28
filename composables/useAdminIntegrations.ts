import { computed, ref } from "vue";

import type {
  AdminGithubIntegrationState,
  AdminLinkedinIntegrationState,
} from "~/types/integrations";

function resolveFetchError(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const data = (error as { data?: { statusMessage?: string } }).data;
    if (data && typeof data.statusMessage === "string" && data.statusMessage.trim().length > 0) {
      return data.statusMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useAdminIntegrations() {
  const runtimeConfig = useRuntimeConfig();
  const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName);

  const githubState = ref<AdminGithubIntegrationState | null>(null);
  const githubLoading = ref(false);
  const githubError = ref<string | null>(null);
  const githubActionLoading = ref(false);

  const linkedinState = ref<AdminLinkedinIntegrationState | null>(null);
  const linkedinLoading = ref(false);
  const linkedinError = ref<string | null>(null);
  const linkedinActionLoading = ref(false);

  const headers = computed(() => ({ "x-csrf-token": csrfCookie.value ?? "" }));

  async function refreshGithub() {
    githubLoading.value = true;
    githubError.value = null;
    try {
      githubState.value = await $fetch<AdminGithubIntegrationState>("/api/admin/integrations/github");
    } catch (error) {
      githubError.value = resolveFetchError(error, "Impossible de charger l’intégration GitHub.");
      throw error;
    } finally {
      githubLoading.value = false;
    }
  }

  async function connectGithub(payload: { username: string; token: string }) {
    githubActionLoading.value = true;
    githubError.value = null;
    try {
      githubState.value = await $fetch<AdminGithubIntegrationState>("/api/admin/integrations/github", {
        method: "PUT",
        body: payload,
        headers: headers.value,
      });
      return githubState.value;
    } catch (error) {
      githubError.value = resolveFetchError(error, "Impossible de connecter GitHub.");
      throw error;
    } finally {
      githubActionLoading.value = false;
    }
  }

  async function disconnectGithub() {
    githubActionLoading.value = true;
    githubError.value = null;
    try {
      githubState.value = await $fetch<AdminGithubIntegrationState>("/api/admin/integrations/github", {
        method: "DELETE",
        headers: headers.value,
      });
    } catch (error) {
      githubError.value = resolveFetchError(error, "Impossible de déconnecter GitHub.");
      throw error;
    } finally {
      githubActionLoading.value = false;
    }
  }

  async function refreshLinkedin(locale?: string) {
    linkedinLoading.value = true;
    linkedinError.value = null;
    try {
      linkedinState.value = await $fetch<AdminLinkedinIntegrationState>("/api/admin/integrations/linkedin", {
        query: locale ? { locale } : undefined,
      });
      return linkedinState.value;
    } catch (error) {
      linkedinError.value = resolveFetchError(error, "Impossible de charger l’intégration LinkedIn.");
      throw error;
    } finally {
      linkedinLoading.value = false;
    }
  }

  async function connectLinkedin(payload: { token: string; locale?: string }) {
    linkedinActionLoading.value = true;
    linkedinError.value = null;
    try {
      linkedinState.value = await $fetch<AdminLinkedinIntegrationState>("/api/admin/integrations/linkedin", {
        method: "PUT",
        body: payload,
        headers: headers.value,
      });
      return linkedinState.value;
    } catch (error) {
      linkedinError.value = resolveFetchError(error, "Impossible de connecter LinkedIn.");
      throw error;
    } finally {
      linkedinActionLoading.value = false;
    }
  }

  async function syncLinkedin(locale?: string) {
    linkedinActionLoading.value = true;
    linkedinError.value = null;
    try {
      linkedinState.value = await $fetch<AdminLinkedinIntegrationState>("/api/admin/integrations/linkedin/sync", {
        method: "POST",
        body: locale ? { locale } : {},
        headers: headers.value,
      });
      return linkedinState.value;
    } catch (error) {
      linkedinError.value = resolveFetchError(error, "Impossible de synchroniser LinkedIn.");
      throw error;
    } finally {
      linkedinActionLoading.value = false;
    }
  }

  async function disconnectLinkedin() {
    linkedinActionLoading.value = true;
    linkedinError.value = null;
    try {
      linkedinState.value = await $fetch<AdminLinkedinIntegrationState>("/api/admin/integrations/linkedin", {
        method: "DELETE",
        headers: headers.value,
      });
    } catch (error) {
      linkedinError.value = resolveFetchError(error, "Impossible de déconnecter LinkedIn.");
      throw error;
    } finally {
      linkedinActionLoading.value = false;
    }
  }

  return {
    githubState,
    githubLoading,
    githubError,
    githubActionLoading,
    linkedinState,
    linkedinLoading,
    linkedinError,
    linkedinActionLoading,
    refreshGithub,
    connectGithub,
    disconnectGithub,
    refreshLinkedin,
    connectLinkedin,
    disconnectLinkedin,
    syncLinkedin,
  };
}
