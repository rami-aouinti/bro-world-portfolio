<template>
  <section class="github-project-detail">
    <v-container class="py-12 github-project-detail__container">
      <v-btn
        :to="backLink"
        variant="text"
        color="primary"
        class="text-none github-project-detail__back"
        prepend-icon="mdi-arrow-left"
      >
        {{ t("portfolio.githubProjects.backToProjects") }}
      </v-btn>

      <header class="github-project-detail__header">
        <h1 class="text-h3 text-foreground github-project-detail__title">
          {{ project.name }}
        </h1>
        <p class="text-body-1 text-muted-foreground github-project-detail__description">
          {{ project.description || t("portfolio.githubProjects.noDescription") }}
        </p>
      </header>

      <v-row
        dense
        class="github-project-detail__grid"
      >
        <v-col cols="12" md="8">
          <v-card
            variant="tonal"
            color="primary"
            class="github-project-detail__card"
          >
            <v-card-title class="github-project-detail__card-title">
              {{ t("portfolio.githubProjects.overview") }}
            </v-card-title>

            <v-card-text class="github-project-detail__card-text">
              <dl class="github-project-detail__meta">
                <div>
                  <dt>{{ t("portfolio.githubProjects.primaryLanguage") }}</dt>
                  <dd>{{ project.primaryLanguage ?? t("portfolio.githubProjects.languageUnknown") }}</dd>
                </div>
                <div>
                  <dt>{{ t("portfolio.githubProjects.homepage") }}</dt>
                  <dd>
                    <NuxtLink
                      v-if="project.homepage"
                      :to="project.homepage"
                      target="_blank"
                      rel="noopener"
                      class="github-project-detail__link"
                    >
                      {{ project.homepage }}
                    </NuxtLink>
                    <span v-else>{{ t("portfolio.githubProjects.homepageMissing") }}</span>
                  </dd>
                </div>
                <div>
                  <dt>{{ t("portfolio.githubProjects.createdAt") }}</dt>
                  <dd>{{ formatDate(project.createdAt) }}</dd>
                </div>
                <div>
                  <dt>{{ t("portfolio.githubProjects.updatedAt") }}</dt>
                  <dd>{{ formatDate(project.updatedAt) }}</dd>
                </div>
              </dl>

              <div
                v-if="project.topics.length"
                class="github-project-detail__topics"
              >
                <h2 class="github-project-detail__section-title">
                  {{ t("portfolio.githubProjects.topics") }}
                </h2>
                <div class="github-project-detail__topics-list">
                  <v-chip
                    v-for="topic in project.topics"
                    :key="topic"
                    label
                    size="small"
                    class="github-project-detail__topic"
                  >
                    #{{ topic }}
                  </v-chip>
                </div>
              </div>

              <div
                v-if="project.languages.length"
                class="github-project-detail__languages"
              >
                <h2 class="github-project-detail__section-title">
                  {{ t("portfolio.githubProjects.languages") }}
                </h2>
                <ul class="github-project-detail__languages-list">
                  <li v-for="language in project.languages" :key="language.name">
                    <span>{{ language.name }}</span>
                    <span class="github-project-detail__language-share">
                      {{ language.share }}%
                    </span>
                  </li>
                </ul>
              </div>
            </v-card-text>

            <v-card-actions class="github-project-detail__actions">
              <v-btn
                :href="project.url"
                target="_blank"
                rel="noopener"
                color="primary"
                class="text-none"
                append-icon="mdi-open-in-new"
              >
                {{ t("portfolio.githubProjects.viewOnGithub") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            variant="tonal"
            color="primary"
            class="github-project-detail__card"
          >
            <v-card-title class="github-project-detail__card-title">
              {{ t("portfolio.githubProjects.statistics") }}
            </v-card-title>

            <v-card-text>
              <ul class="github-project-detail__stats">
                <li>
                  <span>{{ t("portfolio.githubProjects.stars") }}</span>
                  <strong>{{ project.stars }}</strong>
                </li>
                <li>
                  <span>{{ t("portfolio.githubProjects.forks") }}</span>
                  <strong>{{ project.forks }}</strong>
                </li>
                <li>
                  <span>{{ t("portfolio.githubProjects.openIssues") }}</span>
                  <strong>{{ project.openIssues }}</strong>
                </li>
                <li>
                  <span>{{ t("portfolio.githubProjects.watchers") }}</span>
                  <strong>{{ project.watchers }}</strong>
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { createError } from "#app";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

interface GithubProjectDetail {
  slug: string;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  createdAt: string;
  updatedAt: string;
  primaryLanguage: string | null;
  languages: { name: string; share: number }[];
}

const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();

const slug = computed(() => route.params.slug?.toString() ?? "");

if (!slug.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

const backLink = computed(() => resolveLocalizedRouteTarget("/projects", localePath));

const { data, error } = await useAsyncData<GithubProjectDetail>(
  `github-project-${slug.value}`,
  () => $fetch(`/api/github/projects/${slug.value}`),
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

const project = computed(() => {
  if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }

  return data.value;
});

function formatDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat(locale.value, { dateStyle: "medium" }).format(date);
}

useSeoMeta(() => ({
  title: `${project.value.name} · ${t("portfolio.githubProjects.metaTitle")}`,
  description: project.value.description ?? t("portfolio.githubProjects.metaDescription"),
}));
</script>

<style scoped>
.github-project-detail__container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.github-project-detail__back {
  align-self: flex-start;
  padding-left: 0;
}

.github-project-detail__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.github-project-detail__description {
  margin: 0;
}

.github-project-detail__grid {
  margin-top: 8px;
}

.github-project-detail__card {
  height: 100%;
}

.github-project-detail__card-title {
  font-weight: 600;
}

.github-project-detail__card-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.github-project-detail__meta {
  display: grid;
  gap: 16px;
}

.github-project-detail__meta dt {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(226, 232, 240, 0.75);
}

.github-project-detail__meta dd {
  margin: 4px 0 0;
  font-size: 1rem;
}

.github-project-detail__link {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(59, 130, 246, 0.5);
}

.github-project-detail__topics-list,
.github-project-detail__languages-list,
.github-project-detail__stats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.github-project-detail__topics-list {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}

.github-project-detail__section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.github-project-detail__topic {
  text-transform: none;
}

.github-project-detail__languages-list li {
  display: flex;
  justify-content: space-between;
}

.github-project-detail__language-share {
  opacity: 0.8;
}

.github-project-detail__stats li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.github-project-detail__actions {
  justify-content: flex-end;
}
</style>
