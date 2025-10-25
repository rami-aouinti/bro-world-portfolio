<template>
  <section class="github-projects">
    <v-container class="py-12 github-projects__container">
      <header class="github-projects__header">
        <v-chip
          label
          color="primary"
          variant="tonal"
          class="github-projects__badge"
        >
          {{ t("portfolio.githubProjects.badge") }}
        </v-chip>
        <h1 class="text-h4 text-foreground github-projects__title">
          {{ t("portfolio.githubProjects.title") }}
        </h1>
        <p class="text-body-1 text-muted-foreground github-projects__lead">
          {{ t("portfolio.githubProjects.description") }}
        </p>
      </header>

      <div v-if="status === 'pending'" class="github-projects__loading">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <span class="github-projects__loading-text">
          {{ t("$vuetify.loading") }}
        </span>
      </div>

      <v-alert
        v-else-if="error"
        type="error"
        border="start"
        color="error"
        variant="tonal"
        class="github-projects__alert"
      >
        {{ t("portfolio.githubProjects.error") }}
      </v-alert>

      <div v-else>
        <v-alert
          v-if="!projects.length"
          type="info"
          border="start"
          color="primary"
          variant="tonal"
          class="github-projects__alert"
        >
          {{ t("portfolio.githubProjects.empty") }}
        </v-alert>

        <v-row
          v-else
          dense
          class="github-projects__grid"
        >
          <v-col
            v-for="project in projects"
            :key="project.slug"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              variant="tonal"
              color="primary"
              class="github-projects__card"
            >
              <v-card-title class="github-projects__card-title">
                {{ project.name }}
              </v-card-title>

              <v-card-subtitle class="github-projects__card-subtitle">
                {{ formatDate(project.updatedAt) }} · {{ project.primaryLanguage ?? t("portfolio.githubProjects.languageUnknown") }}
              </v-card-subtitle>

              <v-card-text class="github-projects__card-text">
                {{ project.description || t("portfolio.githubProjects.noDescription") }}
              </v-card-text>

              <div
                v-if="project.topics.length"
                class="github-projects__topics"
              >
                <v-chip
                  v-for="topic in project.topics"
                  :key="topic"
                  label
                  size="small"
                  class="github-projects__topic"
                  variant="outlined"
                >
                  #{{ topic }}
                </v-chip>
              </div>

              <v-card-actions class="github-projects__actions">
                <v-btn
                  :to="projectDetailRoute(project.slug)"
                  variant="flat"
                  color="primary"
                  class="text-none"
                >
                  {{ t("portfolio.githubProjects.viewDetails") }}
                </v-btn>
                <v-btn
                  :href="project.url"
                  target="_blank"
                  rel="noopener"
                  variant="text"
                  color="primary"
                  class="text-none"
                  append-icon="mdi-open-in-new"
                >
                  {{ t("portfolio.githubProjects.viewOnGithub") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";

interface GithubProjectListItem {
  slug: string;
  name: string;
  description: string | null;
  url: string;
  homepage?: string | null;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  primaryLanguage: string | null;
}

const localePath = useLocalePath();
const { t, locale } = useI18n();

const { data, status, error } = await useAsyncData<GithubProjectListItem[]>(
  "github-projects",
  () => $fetch("/api/github/projects"),
  { default: () => [] },
);

const projects = computed(() => data.value ?? []);

function projectDetailRoute(slug: string) {
  return localePath({ name: "projects-slug", params: { slug } });
}

function formatDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat(locale.value, { dateStyle: "medium" }).format(date);
}

definePageMeta(LOCALIZED_PAGE_META.projects);

useSeoMeta(() => ({
  title: t("portfolio.githubProjects.metaTitle"),
  description: t("portfolio.githubProjects.metaDescription"),
}));
</script>

<style scoped>
.github-projects__container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.github-projects__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.github-projects__badge {
  align-self: center;
}

.github-projects__lead {
  margin: 0;
}

.github-projects__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
}

.github-projects__loading-text {
  color: rgba(226, 232, 240, 0.85);
}

.github-projects__alert {
  margin-top: 16px;
}

.github-projects__grid {
  margin-top: 8px;
}

.github-projects__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.github-projects__card-title {
  font-weight: 600;
}

.github-projects__card-subtitle {
  font-size: 0.85rem;
  opacity: 0.8;
}

.github-projects__card-text {
  flex: 1;
  white-space: pre-line;
}

.github-projects__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 8px;
}

.github-projects__topic {
  text-transform: none;
}

.github-projects__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 8px;
}

@media (max-width: 960px) {
  .github-projects__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
