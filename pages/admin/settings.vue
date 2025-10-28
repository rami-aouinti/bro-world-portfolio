<template>
  <v-container class="admin-settings mt-6">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="8"
      >
        <v-card
          class="admin-settings__card"
          elevation="0"
          rounded="xl"
        >
          <div class="admin-settings__glow" />
          <v-card-text class="admin-settings__content">
            <div class="admin-settings__header">
              <div>
                <p class="admin-settings__eyebrow text-caption">
                  {{ t('admin.settings.siteSettings') }}
                </p>
                <h1 class="admin-settings__title">
                  {{ t('admin.navigation.settings') }}
                </h1>
                <p class="admin-settings__subtitle">
                  {{ t('admin.dashboard.settings.subtitle') }}
                </p>
              </div>
            </div>

            <v-card
              class="admin-settings__panel"
              elevation="0"
              rounded="lg"
            >
              <v-card-text>
                <p class="admin-settings__panel-title">
                  {{ t('admin.settings.quickAccess') }}
                </p>
                <v-list
                  class="admin-settings__list"
                  density="comfortable"
                >
                  <v-list-item
                    v-for="link in quickLinks"
                    :key="link.to"
                    :to="link.to"
                    class="admin-settings__list-item"
                    :append-icon="link.icon"
                  >
                    <div class="admin-settings__list-content">
                      <p class="admin-settings__list-title">{{ link.label }}</p>
                      <p class="admin-settings__list-description">{{ link.description }}</p>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-card
              class="admin-settings__panel"
              elevation="0"
              rounded="lg"
            >
              <v-card-text class="admin-integrations">
                <div class="admin-integrations__header">
                  <div>
                    <p class="admin-settings__panel-title">
                      {{ t('admin.settings.integrations.title') }}
                    </p>
                    <p class="admin-integrations__subtitle">
                      {{ t('admin.settings.integrations.subtitle') }}
                    </p>
                  </div>
                </div>

                <v-row
                  dense
                  class="admin-integrations__grid"
                >
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <section class="admin-integration-card">
                      <header class="admin-integration-card__header">
                        <div>
                          <h3 class="admin-integration-card__title">
                            {{ t('admin.settings.integrations.github.title') }}
                          </h3>
                          <p class="admin-integration-card__description">
                            {{ t('admin.settings.integrations.github.description') }}
                          </p>
                        </div>
                        <v-chip
                          :color="githubState?.connected ? 'success' : 'primary'"
                          size="small"
                          variant="flat"
                          class="admin-integration-card__chip"
                        >
                          {{ githubState?.connected
                            ? t('admin.settings.integrations.status.connected')
                            : t('admin.settings.integrations.status.disconnected') }}
                        </v-chip>
                      </header>

                      <v-alert
                        v-if="githubError"
                        type="error"
                        variant="tonal"
                        class="admin-integration-card__alert"
                      >
                        {{ githubError }}
                      </v-alert>
                      <v-alert
                        v-if="githubSuccess"
                        type="success"
                        variant="tonal"
                        class="admin-integration-card__alert"
                      >
                        {{ githubSuccess }}
                      </v-alert>

                      <div
                        v-if="githubState?.connected && githubState.profile"
                        class="admin-integration-profile"
                      >
                        <v-avatar
                          v-if="githubState.profile.avatarUrl"
                          size="64"
                          class="admin-integration-profile__avatar"
                        >
                          <img
                            :src="githubState.profile.avatarUrl"
                            :alt="githubState.profile.name || githubState.profile.login"
                          >
                        </v-avatar>
                        <div class="admin-integration-profile__meta">
                          <p class="admin-integration-profile__name">
                            {{ githubState.profile.name || githubState.profile.login }}
                          </p>
                          <p class="admin-integration-profile__login">
                            @{{ githubState.profile.login }}
                          </p>
                          <ul class="admin-integration-profile__stats">
                            <li>
                              <strong>{{ githubState.profile.publicRepos }}</strong>
                              <span>{{ t('admin.settings.integrations.github.repos') }}</span>
                            </li>
                            <li>
                              <strong>{{ githubState.profile.followers }}</strong>
                              <span>{{ t('admin.settings.integrations.github.followers') }}</span>
                            </li>
                            <li>
                              <strong>{{ githubState.profile.following }}</strong>
                              <span>{{ t('admin.settings.integrations.github.following') }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <v-form
                        class="admin-integration-card__form"
                        @submit.prevent="handleGithubConnect"
                      >
                        <v-text-field
                          v-model="githubForm.username"
                          :label="t('admin.settings.integrations.github.username')"
                          density="comfortable"
                          variant="outlined"
                          autocomplete="username"
                          required
                        />
                        <v-text-field
                          v-model="githubForm.token"
                          :label="t('admin.settings.integrations.github.token')"
                          :hint="t('admin.settings.integrations.github.tokenHint')"
                          density="comfortable"
                          variant="outlined"
                          type="password"
                          autocomplete="off"
                          persistent-hint
                        />
                        <div class="admin-integration-card__actions">
                          <v-btn
                            type="submit"
                            color="primary"
                            class="text-none"
                            :loading="githubActionLoading"
                          >
                            {{ t('admin.settings.integrations.github.connect') }}
                          </v-btn>
                          <v-btn
                            variant="tonal"
                            color="primary"
                            class="text-none"
                            :loading="githubLoading"
                            @click="() => refreshGithub()"
                          >
                            {{ t('admin.settings.integrations.github.refresh') }}
                          </v-btn>
                          <v-btn
                            variant="text"
                            color="error"
                            class="text-none"
                            :disabled="!githubState?.connected"
                            :loading="githubActionLoading"
                            @click="handleGithubDisconnect"
                          >
                            {{ t('admin.settings.integrations.disconnect') }}
                          </v-btn>
                        </div>
                      </v-form>

                      <div
                        v-if="githubProjectsPreview.length"
                        class="admin-integration-card__list"
                      >
                        <p class="admin-integration-card__list-title">
                          {{ t('admin.settings.integrations.github.projectsTitle') }}
                        </p>
                        <ul>
                          <li
                            v-for="project in githubProjectsPreview"
                            :key="project.slug"
                          >
                            <div class="admin-integration-card__list-item">
                              <span class="admin-integration-card__list-name">{{ project.name }}</span>
                              <span class="admin-integration-card__list-meta">
                                {{ formatDateTime(project.updatedAt) }}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </section>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <section class="admin-integration-card">
                      <header class="admin-integration-card__header">
                        <div>
                          <h3 class="admin-integration-card__title">
                            {{ t('admin.settings.integrations.linkedin.title') }}
                          </h3>
                          <p class="admin-integration-card__description">
                            {{ t('admin.settings.integrations.linkedin.description') }}
                          </p>
                        </div>
                        <v-chip
                          :color="linkedinState?.connected ? 'success' : 'primary'"
                          size="small"
                          variant="flat"
                          class="admin-integration-card__chip"
                        >
                          {{ linkedinState?.connected
                            ? t('admin.settings.integrations.status.connected')
                            : t('admin.settings.integrations.status.disconnected') }}
                        </v-chip>
                      </header>

                      <v-alert
                        v-if="linkedinError"
                        type="error"
                        variant="tonal"
                        class="admin-integration-card__alert"
                      >
                        {{ linkedinError }}
                      </v-alert>
                      <v-alert
                        v-if="linkedinSuccess"
                        type="success"
                        variant="tonal"
                        class="admin-integration-card__alert"
                      >
                        {{ linkedinSuccess }}
                      </v-alert>

                      <div
                        v-if="linkedinState?.connected && linkedinState.profile"
                        class="admin-integration-profile"
                      >
                        <v-avatar
                          v-if="linkedinState.profile.avatarUrl"
                          size="64"
                          class="admin-integration-profile__avatar"
                        >
                          <img
                            :src="linkedinState.profile.avatarUrl"
                            :alt="linkedinDisplayName"
                          >
                        </v-avatar>
                        <div class="admin-integration-profile__meta">
                          <p class="admin-integration-profile__name">
                            {{ linkedinDisplayName }}
                          </p>
                          <p class="admin-integration-profile__login">
                            {{ linkedinState.profile.headline }}
                          </p>
                          <ul class="admin-integration-profile__stats">
                            <li>
                              <strong>{{ linkedinState.experiences.length }}</strong>
                              <span>{{ t('admin.settings.integrations.linkedin.experienceCount') }}</span>
                            </li>
                            <li>
                              <strong>{{ linkedinState.education.length }}</strong>
                              <span>{{ t('admin.settings.integrations.linkedin.educationCount') }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <v-form
                        class="admin-integration-card__form"
                        @submit.prevent="handleLinkedinConnect"
                      >
                        <v-text-field
                          v-model="linkedinForm.token"
                          :label="t('admin.settings.integrations.linkedin.token')"
                          :hint="t('admin.settings.integrations.linkedin.tokenHint')"
                          density="comfortable"
                          variant="outlined"
                          type="password"
                          autocomplete="off"
                          persistent-hint
                        />
                        <v-select
                          v-model="linkedinLocale"
                          :items="linkedinLocaleItems"
                          :label="t('admin.settings.integrations.linkedin.locale')"
                          density="comfortable"
                          variant="outlined"
                        />
                        <div class="admin-integration-card__actions">
                          <v-btn
                            type="submit"
                            color="primary"
                            class="text-none"
                            :loading="linkedinActionLoading"
                          >
                            {{ t('admin.settings.integrations.linkedin.connect') }}
                          </v-btn>
                          <v-btn
                            variant="tonal"
                            color="primary"
                            class="text-none"
                            :loading="linkedinActionLoading"
                            @click="handleLinkedinSync"
                          >
                            {{ t('admin.settings.integrations.linkedin.sync') }}
                          </v-btn>
                          <v-btn
                            variant="tonal"
                            color="primary"
                            class="text-none"
                            :loading="linkedinLoading"
                            @click="() => refreshLinkedin(linkedinLocale.value)"
                          >
                            {{ t('admin.settings.integrations.linkedin.refresh') }}
                          </v-btn>
                          <v-btn
                            variant="text"
                            color="error"
                            class="text-none"
                            :disabled="!linkedinState?.connected"
                            :loading="linkedinActionLoading"
                            @click="handleLinkedinDisconnect"
                          >
                            {{ t('admin.settings.integrations.disconnect') }}
                          </v-btn>
                        </div>
                      </v-form>

                      <div class="admin-integration-card__meta">
                        <p>
                          <strong>{{ t('admin.settings.integrations.lastSynced') }}:</strong>
                          <span>{{ formatDateTime(linkedinState?.lastSyncedAt) }}</span>
                        </p>
                        <p>
                          <strong>{{ t('admin.settings.integrations.connectedAt') }}:</strong>
                          <span>{{ formatDateTime(linkedinState?.connectedAt) }}</span>
                        </p>
                      </div>
                    </section>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";

import { useAdminIntegrations } from "~/composables/useAdminIntegrations";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "~/utils/i18n/locales";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const { t, locale } = useI18n();

const {
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
} = useAdminIntegrations();

const githubForm = reactive({ username: "", token: "" });
const githubSuccess = ref("");

watch(
  githubState,
  (state) => {
    if (state?.username) {
      githubForm.username = state.username;
    }
  },
  { immediate: true },
);

const githubProjectsPreview = computed(() => (githubState.value?.projects ?? []).slice(0, 5));

async function handleGithubConnect() {
  githubSuccess.value = "";
  try {
    await connectGithub({
      username: githubForm.username.trim(),
      token: githubForm.token.trim(),
    });
    githubForm.token = "";
    githubSuccess.value = t("admin.settings.integrations.github.connectedMessage");
  } catch {
    // Errors are surfaced via githubError
  }
}

async function handleGithubDisconnect() {
  githubSuccess.value = "";
  try {
    await disconnectGithub();
  } catch {
    // handled via error state
  }
}

const linkedinForm = reactive({ token: "" });
const linkedinSuccess = ref("");
const linkedinLocale = ref<string>(DEFAULT_LOCALE);

const linkedinLocaleItems = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({ value: code, title: code.toUpperCase() })),
);

watch(
  linkedinState,
  (state) => {
    if (state?.locale) {
      linkedinLocale.value = state.locale;
    }
  },
  { immediate: true },
);

const linkedinDisplayName = computed(() => {
  const profile = linkedinState.value?.profile;
  if (!profile) {
    return t("admin.settings.integrations.linkedin.unknown");
  }

  const first = profile.firstName?.trim() ?? "";
  const last = profile.lastName?.trim() ?? "";
  const combined = `${first} ${last}`.trim();
  return combined || profile.headline || t("admin.settings.integrations.linkedin.unknown");
});

async function handleLinkedinConnect() {
  linkedinSuccess.value = "";
  try {
    await connectLinkedin({ token: linkedinForm.token.trim(), locale: linkedinLocale.value });
    linkedinForm.token = "";
    linkedinSuccess.value = t("admin.settings.integrations.linkedin.connectedMessage");
  } catch {
    // handled via linkedinError
  }
}

async function handleLinkedinSync() {
  linkedinSuccess.value = "";
  try {
    await syncLinkedin(linkedinLocale.value);
    linkedinSuccess.value = t("admin.settings.integrations.linkedin.syncedMessage");
  } catch {
    // handled via linkedinError
  }
}

async function handleLinkedinDisconnect() {
  linkedinSuccess.value = "";
  try {
    await disconnectLinkedin();
  } catch {
    // handled via linkedinError
  }
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return t("admin.settings.integrations.neverSynced");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

onMounted(() => {
  refreshGithub().catch(() => {});
  refreshLinkedin().catch(() => {});
});

const quickLinks = computed(() => [
  {
    to: "/admin/design",
    icon: "mdi-palette-outline",
    label: t("admin.navigation.design"),
    description: t("admin.dashboard.settings.subtitle"),
  },
  {
    to: "/admin/content/navlinks",
    icon: "mdi-compass-outline",
    label: t("admin.dashboard.sections.navlinks.title"),
    description: t("admin.dashboard.sections.navlinks.description"),
  },
  {
    to: "/admin/content/profile",
    icon: "mdi-account-circle-outline",
    label: t("admin.dashboard.sections.profile.title"),
    description: t("admin.dashboard.sections.profile.description"),
  },
]);
</script>

<style scoped>
.admin-settings__card {
  position: relative;
  overflow: hidden;
  border-radius: var(--admin-surface-radius, 28px);
  border: 1px solid var(--admin-glass-border, rgba(37, 99, 235, 0.18));
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.92)) 94%, transparent);
  box-shadow: 0 34px 70px -45px var(--admin-surface-shadow, rgba(37, 99, 235, 0.75));
}

.admin-settings__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 10% 30%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(79, 70, 229, 0.3), transparent 65%);
  pointer-events: none;
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.admin-settings__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.admin-settings__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.admin-settings__eyebrow {
  color: rgba(191, 219, 254, 0.9);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.admin-settings__title {
  margin: 0 0 8px;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  color: rgb(226, 232, 240);
}

.admin-settings__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 520px;
}

.admin-settings__panel {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: calc(var(--admin-surface-radius, 28px) - 10px);
}

.admin-settings__panel-title {
  margin: 0 0 16px;
  font-weight: 600;
  color: rgb(226, 232, 240);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.admin-settings__list {
  padding: 0;
}

.admin-settings__list-item {
  border-radius: 12px;
  margin-bottom: 12px;
}

.admin-settings__list-item:hover,
.admin-settings__list-item:focus-visible {
  background: rgba(96, 165, 250, 0.1);
}

.admin-settings__list-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-settings__list-title {
  margin: 0;
  font-weight: 600;
  color: rgb(226, 232, 240);
}

.admin-settings__list-description {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  font-size: 0.9rem;
}

.admin-integrations {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-integrations__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.admin-integrations__subtitle {
  margin: 4px 0 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 520px;
}

.admin-integrations__grid {
  gap: 16px 0;
}

.admin-integration-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  min-height: 100%;
}

.admin-integration-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.admin-integration-card__title {
  margin: 0;
  font-size: 1.25rem;
  color: rgb(226, 232, 240);
}

.admin-integration-card__description {
  margin: 4px 0 0;
  color: rgba(226, 232, 240, 0.7);
}

.admin-integration-card__chip {
  align-self: flex-start;
}

.admin-integration-card__alert {
  margin: 0;
}

.admin-integration-profile {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.admin-integration-profile__avatar {
  flex-shrink: 0;
}

.admin-integration-profile__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.admin-integration-profile__name {
  margin: 0;
  font-weight: 600;
  color: rgb(226, 232, 240);
}

.admin-integration-profile__login {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  font-size: 0.9rem;
}

.admin-integration-profile__stats {
  display: flex;
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
  color: rgba(226, 232, 240, 0.8);
}

.admin-integration-profile__stats li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.85rem;
}

.admin-integration-card__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-integration-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-integration-card__list {
  margin: 0;
  padding: 0;
}

.admin-integration-card__list-title {
  margin: 0 0 8px;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.85);
}

.admin-integration-card__list-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.admin-integration-card__list-name {
  color: rgb(226, 232, 240);
  font-weight: 500;
}

.admin-integration-card__list-meta {
  color: rgba(226, 232, 240, 0.6);
  font-size: 0.85rem;
}

.admin-integration-card__meta {
  display: grid;
  gap: 4px;
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.75);
}

.admin-integration-card__meta strong {
  font-weight: 600;
  color: rgba(226, 232, 240, 0.85);
}

@media (max-width: 960px) {
  .admin-integration-profile {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-integration-card__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
