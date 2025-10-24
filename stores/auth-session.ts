import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { Router } from "vue-router";
import { useNuxtApp, useRequestHeaders, useRuntimeConfig, useState } from "#imports";
import { buildLocalizedPath, resolveLocaleFromPath } from "~/lib/i18n/locale-path";
import { defineStore } from "~/lib/pinia-shim";
import type { AuthLoginEnvelope, AuthSessionEnvelope, AuthUser } from "~/types/auth";
import type { ProfileUser } from "~/types/pages/profile";
import type { MercureTokenEnvelope, MercureTokenState } from "~/types/mercure";
import { createApiFetcher, type ApiRequestOptions } from "~/lib/api/http-client";
import { resolveApiFetcher } from "~/lib/api/fetcher";
import axios, { isAxiosError } from "axios";
import { useProfileStore } from "~/stores/profile";
import { sanitizeAuthToken, useSessionCookies } from "~/lib/auth/session-cookies";

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LogoutOptions {
  redirect?: boolean;
  redirectTo?: string | null;
  notify?: boolean;
}

type Fetcher = <T>(request: string, options?: ApiRequestOptions) => Promise<T>;

function resolveFetcher(): Fetcher {
  if (import.meta.server) {
    const runtimeConfig = useRuntimeConfig();
    const baseURL =
      (runtimeConfig.auth?.apiBase as string | undefined)?.trim() ||
      (runtimeConfig.public?.apiBase as string | undefined)?.trim() ||
      "/api";
    const forwardedHeaders = useRequestHeaders(["cookie", "authorization"]);
    const client = axios.create({
      baseURL,
      withCredentials: true,
    });

    client.interceptors.request.use((config) => {
      const headers = { ...(config.headers ?? {}) };

      if (forwardedHeaders.cookie && !headers.Cookie) {
        headers.Cookie = forwardedHeaders.cookie;
      }

      if (forwardedHeaders.authorization && !headers.Authorization) {
        headers.Authorization = forwardedHeaders.authorization;
      }

      config.headers = headers;

      return config;
    });

    return createApiFetcher(client);
  }

  return resolveApiFetcher();
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const maybeMessage = (error as { data?: { message?: unknown } }).data?.message;

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeStatus = (error as { response?: { status?: number } }).response?.status;

    if (maybeStatus === 429) {
      return "Too many login attempts. Please try again later.";
    }

    if (maybeStatus === 400 || maybeStatus === 401) {
      return "We could not verify those credentials. Please try again.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to sign in at this time. Please try again later.";
}

export const useAuthSession = defineStore("auth-session", () => {
  const sessionCookies = useSessionCookies();
  const currentUserState = useState<AuthUser | null>(
    "auth-current-user",
    () => (sessionCookies.user.value as AuthUser | null) ?? null,
  );
  const tokenAvailableState = useState<boolean>(
    "auth-token-available",
    () => sessionCookies.hasPresence.value,
  );
  const readyState = useState<boolean>("auth-ready", () => import.meta.server);
  const redirectState = useState<string | null>("auth-redirect-target", () => null);
  const mercureTokenState = useState<MercureTokenState | null>("auth-mercure-token", () => null);
  const sessionTokenState = useState<string | null>(
    "auth-session-token",
    () => sessionCookies.token.value,
  );

  const loginPendingState = ref(false);
  const loginErrorState = ref<string | null>(null);
  const sessionMessageState = ref<string | null>(null);
  const handlingUnauthorizedState = ref(false);

  const nuxtApp = useNuxtApp();

  function translate(key: string) {
    return nuxtApp.$i18n?.t?.(key) ?? key;
  }

  function resolveRouter(): Router | null {
    const injectedRouter = nuxtApp.$router as Router | undefined;

    if (injectedRouter) {
      return injectedRouter;
    }

    if (!import.meta.client) {
      return null;
    }

    try {
      return useRouter();
    } catch {
      return null;
    }
  }

  if (sessionCookies.hasPresence.value) {
    tokenAvailableState.value = true;
  }

  if (sessionCookies.user.value) {
    currentUserState.value = sessionCookies.user.value as AuthUser;
  }

  if (sessionCookies.token.value) {
    sessionTokenState.value = sessionCookies.token.value;
    tokenAvailableState.value = true;
  }

  if (!sessionTokenState.value && sessionCookies.token.value) {
    sessionTokenState.value = sessionCookies.token.value;
    tokenAvailableState.value = true;
  }

  if (import.meta.client) {
    watch(
      currentUserState,
      (value) => {
        sessionCookies.setUser(value);
      },
      { deep: true },
    );

    watch(
      sessionTokenState,
      (value) => {
        if (sessionCookies.token.value !== value) {
          sessionCookies.setToken(value);
        }
        tokenAvailableState.value = Boolean(value);
      },
      { immediate: true },
    );

    watch(
      tokenAvailableState,
      (value) => {
        if (sessionCookies.hasPresence.value !== value) {
          sessionCookies.setTokenPresence(value);
        }
      },
      { immediate: true },
    );
  }

  const currentUser = computed(() => currentUserState.value);
  const isAuthenticated = computed(
    () => tokenAvailableState.value && Boolean(currentUserState.value),
  );
  const isReady = computed(() => readyState.value);
  const loginError = computed(() => loginErrorState.value);
  const isLoggingIn = computed(() => loginPendingState.value);
  const sessionMessage = computed(() => sessionMessageState.value);
  const mercureToken = computed(() => mercureTokenState.value?.token ?? null);
  const sessionToken = computed(() => sessionTokenState.value);

  function setCurrentUser(user: AuthUser | null) {
    currentUserState.value = user;
    sessionCookies.setUser(user);

    try {
      const profileStore = useProfileStore();
      profileStore.setProfile(user as ProfileUser | null);
    } catch (error) {
      console.error("Failed to sync profile store", error);
    }
  }

  function setTokenPresence(present: boolean) {
    tokenAvailableState.value = present;
    sessionCookies.setTokenPresence(present);
  }

  function setMercureToken(token: MercureTokenState | null) {
    mercureTokenState.value = token;
  }

  function setSessionToken(token: string | null) {
    const sanitized = sanitizeAuthToken(token);
    sessionTokenState.value = sanitized;
    sessionCookies.setToken(sanitized);
    tokenAvailableState.value = Boolean(sanitized);
  }

  function setSessionMessage(message: string | null) {
    sessionMessageState.value = message;
  }

  function clearLoginError() {
    loginErrorState.value = null;
  }

  function clearSession() {
    setCurrentUser(null);
    setTokenPresence(false);
    setMercureToken(null);
    setSessionToken(null);
    loginErrorState.value = null;
    readyState.value = true;

    try {
      const profileStore = useProfileStore();
      profileStore.clearProfile();
    } catch (error) {
      console.error("Failed to clear profile store", error);
    }
  }

  function setRedirect(path: string | null) {
    redirectState.value = path;
  }

  function consumeRedirect(): string | null {
    const target = redirectState.value;
    redirectState.value = null;
    return target;
  }

  function consumeSessionMessage(): string | null {
    const message = sessionMessageState.value;
    sessionMessageState.value = null;
    return message;
  }

  function resolveMercureExpiry(payload: MercureTokenEnvelope): number | null {
    if (payload.expiresAt) {
      const parsed = Date.parse(payload.expiresAt);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    if (typeof payload.expiresIn === "number" && Number.isFinite(payload.expiresIn)) {
      return Date.now() + Math.max(0, payload.expiresIn) * 1000;
    }

    return null;
  }

  function persistMercureToken(payload: MercureTokenEnvelope | null) {
    if (!payload || !payload.token) {
      setMercureToken(null);
      return null;
    }

    const expiresAt = resolveMercureExpiry(payload);
    const state: MercureTokenState = {
      token: payload.token,
      expiresAt,
    };

    setMercureToken(state);

    return state;
  }

  async function fetchMercureToken(): Promise<MercureTokenState | null> {
    if (!tokenAvailableState.value) {
      setMercureToken(null);
      return null;
    }

    try {
      const responseFetcher = resolveFetcher();
      const response = await responseFetcher<MercureTokenEnvelope>("mercure/token", {
        method: "GET",
        context: {
          suppressErrorNotification: true,
          isPrivate: true,
        },
      });

      if (!response?.token) {
        setMercureToken(null);
        return null;
      }

      return persistMercureToken(response);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setMercureToken(null);
        return null;
      }

      console.error("Failed to fetch Mercure token", error);
      setMercureToken(null);
      return null;
    }
  }

  async function synchronizeSessionFromServer(): Promise<AuthSessionEnvelope | null> {
    try {
      const fetcher = resolveFetcher();
      const response = await fetcher<AuthSessionEnvelope>("/auth/session", {
        method: "GET",
        context: {
          isPrivate: true,
          skipAuthHeader: true,
          suppressErrorNotification: true,
        },
      });

      if (import.meta.client) {
        sessionCookies.syncFromDocument();
      }

      if (response?.authenticated) {
        setTokenPresence(true);

        if (response.user) {
          setCurrentUser(response.user);
        } else if (!currentUserState.value && sessionCookies.user.value) {
          setCurrentUser(sessionCookies.user.value as AuthUser);
        }
      }

      return response ?? null;
    } catch (error) {
      console.error("Failed to synchronize auth session", error);
      return null;
    }
  }

  async function refreshSession() {
    if (!tokenAvailableState.value && sessionCookies.hasPresence.value) {
      tokenAvailableState.value = true;
    }

    if (!currentUserState.value && sessionCookies.user.value) {
      setCurrentUser(sessionCookies.user.value as AuthUser);
    }

    if (!sessionTokenState.value && sessionCookies.token.value) {
      sessionTokenState.value = sessionCookies.token.value;
    }

    let serverSession: AuthSessionEnvelope | null = null;

    const shouldSyncFromServer =
      sessionCookies.hasPresenceCookie.value &&
      (!sessionTokenState.value ||
        !sessionCookies.token.value ||
        (!currentUserState.value && !sessionCookies.user.value));

    if (shouldSyncFromServer) {
      serverSession = await synchronizeSessionFromServer();

      if (serverSession?.authenticated) {
        if (!sessionTokenState.value && sessionCookies.token.value) {
          sessionTokenState.value = sessionCookies.token.value;
        }

        if (!currentUserState.value) {
          if (serverSession.user) {
            setCurrentUser(serverSession.user);
          } else if (sessionCookies.user.value) {
            setCurrentUser(sessionCookies.user.value as AuthUser);
          }
        }
      } else if (serverSession && !serverSession.authenticated) {
        clearSession();
        readyState.value = true;
        return false;
      }
    }

    const resolvedToken = sessionTokenState.value ?? sessionCookies.token.value ?? null;

    if (resolvedToken) {
      if (!sessionTokenState.value) {
        sessionTokenState.value = resolvedToken;
      }

      setTokenPresence(true);

      readyState.value = true;
      await fetchMercureToken();

      const profileStore = useProfileStore();

      if (!currentUserState.value) {
        try {
          const profile = await profileStore.fetchProfile({ force: true });

          if (profile) {
            setCurrentUser(profile);
          }
        } catch (error) {
          console.error("Failed to refresh profile", error);
        }
      } else if (!profileStore.profile.value) {
        profileStore.setProfile(currentUserState.value as ProfileUser);
        void profileStore
          .fetchProfile({ background: true })
          .then((profile) => {
            if (profile) {
              setCurrentUser(profile);
            }
          })
          .catch((error) => {
            console.error("Background profile refresh failed", error);
          });
      }

      return Boolean(currentUserState.value);
    }

    if (
      !shouldSyncFromServer ||
      serverSession?.authenticated === false ||
      !sessionCookies.hasPresenceCookie.value
    ) {
      clearSession();
    }

    readyState.value = true;
    return false;
  }

  async function initialize() {
    // During client hydration we may have an authenticated session cookie without a
    // hydrated user state (for example if the session cookies were set by the
    // server). In that case we should refresh the session even if the store was
    // previously marked as ready so we can recover the current user information.
    if (import.meta.client && readyState.value && isAuthenticated.value) {
      return true;
    }

    return refreshSession();
  }

  async function login(credentials: LoginCredentials) {
    const trimmedIdentifier = credentials.identifier.trim();
    const password = credentials.password;
    const hasPassword = password.length > 0;

    if (!trimmedIdentifier || !hasPassword) {
      loginErrorState.value = "Please provide both your email or username and password.";
      return false;
    }

    loginPendingState.value = true;
    loginErrorState.value = null;

    const fetcher = resolveFetcher();

    try {
      const payload = new URLSearchParams();
      payload.set("identifier", trimmedIdentifier);
      payload.set("password", password);

      if (trimmedIdentifier.includes("@")) {
        payload.set("email", trimmedIdentifier);
      } else {
        payload.set("username", trimmedIdentifier);
      }

      const response = await fetcher<AuthLoginEnvelope>("/auth/login", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        context: {
          suppressErrorNotification: true,
        },
      });

      const user = response?.user ?? response?.profile;

      if (!user || !response?.token) {
        loginErrorState.value = "Unable to sign in at this time. Please try again later.";
        return false;
      }

      setCurrentUser(user);
      setTokenPresence(true);
      setSessionToken(response.token);
      readyState.value = true;
      sessionMessageState.value = null;

      await fetchMercureToken();

      const profileStore = useProfileStore();

      void profileStore
        .fetchProfile({ force: true, background: true })
        .then((profile) => {
          if (profile) {
            setCurrentUser(profile);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch profile after login", error);
        });

      return true;
    } catch (error) {
      const message = extractErrorMessage(error);
      loginErrorState.value = message;
      return false;
    } finally {
      loginPendingState.value = false;
    }
  }

  async function logout(options: LogoutOptions = {}) {
    const { redirect = true, redirectTo = null, notify = true } = options;
    const fetcher = resolveFetcher();
    const { $notify } = useNuxtApp();

    try {
      await fetcher("/auth/logout", {
        method: "POST",
        context: {
          suppressErrorNotification: true,
        },
      });
    } catch (error) {
      console.warn("Failed to call logout endpoint", error);
    } finally {
      clearSession();
    }

    if (notify) {
      $notify({
        type: "success",
        title: translate("auth.successTitle"),
        message: translate("auth.logoutMessage"),
      });
    }

    if (redirect && import.meta.client) {
      const router = useRouter();
      const currentRoute = router.currentRoute.value;
      const currentPath =
        typeof currentRoute?.path === "string"
          ? currentRoute.path
          : (currentRoute?.fullPath ?? "/");
      const locale = resolveLocaleFromPath(currentPath);
      const target = redirectTo ?? buildLocalizedPath("/login", locale);

      if (currentRoute?.fullPath !== target) {
        await router.push(target);
      }
    }
  }

  async function handleUnauthorized(message?: string) {
    if (handlingUnauthorizedState.value) {
      return;
    }

    handlingUnauthorizedState.value = true;

    try {
      const fallbackMessage = "Your session has expired. Please sign in again.";
      sessionMessageState.value = message ?? fallbackMessage;

      const router = resolveRouter();
      const currentRoute = router?.currentRoute?.value;

      if (currentRoute?.fullPath) {
        setRedirect(currentRoute.fullPath);
      }

      const existingRedirect = redirectState.value;

      await logout({ redirect: false, notify: false });

      const redirectTarget = currentRoute?.fullPath ?? existingRedirect ?? null;
      const resolvedPath =
        typeof currentRoute?.path === "string" ? currentRoute.path : redirectTarget;
      const locale = resolveLocaleFromPath(resolvedPath ?? "/");
      const loginRoute = buildLocalizedPath("/login", locale);
      const query = redirectTarget ? { redirect: redirectTarget } : undefined;

      if (!router) {
        if (redirectTarget) {
          setRedirect(redirectTarget);
        }

        return;
      }

      await router.push({ path: loginRoute, query });
    } finally {
      handlingUnauthorizedState.value = false;
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isReady,
    isLoggingIn,
    loginError,
    sessionMessage,
    redirectAfterLogin: computed(() => redirectState.value),
    mercureToken,
    sessionToken,
    setCurrentUser,
    setRedirect,
    consumeRedirect,
    consumeSessionMessage,
    clearSession,
    initialize,
    refreshSession,
    refreshMercureToken: fetchMercureToken,
    login,
    logout,
    handleUnauthorized,
    setSessionMessage,
    clearLoginError,
  };
});
