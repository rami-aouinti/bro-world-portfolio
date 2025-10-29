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

      <Motion
        as="header"
        class="github-project-detail__hero"
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
        :viewport="{ once: true, amount: 0.5 }"
      >
        <span
          class="github-project-detail__hero-glow"
          aria-hidden="true"
        />
        <h1 class="text-h3 text-foreground github-project-detail__title">
          {{ project.name }}
        </h1>
        <p class="text-body-1 text-muted-foreground github-project-detail__description">
          {{ project.description || t("portfolio.githubProjects.noDescription") }}
        </p>
        <div class="github-project-detail__hero-meta">
          <span class="github-project-detail__hero-pill">
            <v-icon
              icon="mdi-calendar-plus"
              size="18"
              aria-hidden="true"
            />
            {{ t("portfolio.githubProjects.createdAt") }} {{ formatDate(project.createdAt) }}
          </span>
          <span class="github-project-detail__hero-pill">
            <v-icon
              icon="mdi-update"
              size="18"
              aria-hidden="true"
            />
            {{ t("portfolio.githubProjects.updatedAt") }} {{ formatDate(project.updatedAt) }}
          </span>
          <span class="github-project-detail__hero-pill">
            <v-icon
              icon="mdi-code-tags"
              size="18"
              aria-hidden="true"
            />
            {{ project.primaryLanguage ?? t("portfolio.githubProjects.languageUnknown") }}
          </span>
        </div>
      </Motion>

      <v-row
        dense
        class="github-project-detail__grid"
      >
        <v-col
          cols="12"
          md="8"
        >
          <Motion
            :initial="{ opacity: 0, y: 28 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.55, ease: 'easeOut', delay: 0.05 }"
            :viewport="{ once: true, amount: 0.35 }"
          >
            <article class="github-project-detail__panel github-project-detail__panel--main">
              <header class="github-project-detail__panel-header">
                <h2 class="github-project-detail__panel-title">
                  {{ t("portfolio.githubProjects.overview") }}
                </h2>
                <v-btn
                  :href="project.url"
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  append-icon="mdi-open-in-new"
                >
                  {{ t("portfolio.githubProjects.viewOnGithub") }}
                </v-btn>
              </header>

              <dl class="github-project-detail__meta">
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
                  <dt>{{ t("portfolio.githubProjects.primaryLanguage") }}</dt>
                  <dd>
                    {{ project.primaryLanguage ?? t("portfolio.githubProjects.languageUnknown") }}
                  </dd>
                </div>
              </dl>

              <div
                v-if="project.topics.length"
                class="github-project-detail__topics"
              >
                <h3 class="github-project-detail__section-title">
                  {{ t("portfolio.githubProjects.topics") }}
                </h3>
                <div class="github-project-detail__topics-list">
                  <Motion
                    v-for="(topic, index) in project.topics"
                    :key="topic"
                    as="span"
                    class="github-project-detail__topic-wrapper"
                    :initial="{ opacity: 0, y: 12 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.35, delay: 0.1 + index * 0.04 }"
                    :viewport="{ once: true }"
                  >
                    <v-chip
                      label
                      class="github-project-detail__topic"
                      size="small"
                    >
                      #{{ topic }}
                    </v-chip>
                  </Motion>
                </div>
              </div>

              <div
                v-if="project.languages.length"
                class="github-project-detail__languages"
              >
                <h3 class="github-project-detail__section-title">
                  {{ t("portfolio.githubProjects.languages") }}
                </h3>
                <ul class="github-project-detail__languages-list">
                  <li
                    v-for="language in project.languages"
                    :key="language.name"
                    class="github-project-detail__language-item"
                    :style="{ '--share-width': `${language.share}%` }"
                  >
                    <span>{{ language.name }}</span>
                    <span class="github-project-detail__language-share">
                      {{ language.share }}%
                    </span>
                  </li>
                </ul>
              </div>

              <div
                v-if="insightPlatforms.length"
                class="github-project-detail__insights"
              >
                <div class="github-project-detail__insights-header">
                  <div class="github-project-detail__insights-heading">
                    <h3 class="github-project-detail__section-title">
                      {{ t("portfolio.githubProjects.insights.title") }}
                    </h3>
                    <p class="github-project-detail__insights-description">
                      {{ t("portfolio.githubProjects.insights.description") }}
                    </p>
                  </div>
                  <div class="github-project-detail__insights-meta">
                    <span
                      v-if="project.performance?.generatedAt"
                      class="github-project-detail__insights-updated"
                    >
                      {{
                        t("portfolio.githubProjects.insights.generatedAt", {
                          value: formatDate(project.performance.generatedAt),
                        })
                      }}
                    </span>
                    <NuxtLink
                      v-if="project.performance?.reportUrl"
                      :to="project.performance.reportUrl"
                      target="_blank"
                      rel="noopener"
                      class="github-project-detail__link"
                    >
                      {{ t("portfolio.githubProjects.insights.reportLink") }}
                    </NuxtLink>
                  </div>
                </div>

                <div class="github-project-detail__insights-grid">
                  <section
                    v-for="platform in insightPlatforms"
                    :key="platform.key"
                    class="github-project-detail__insight-card"
                  >
                    <header class="github-project-detail__insight-card-header">
                      <v-icon
                        v-if="platform.key === 'mobile'"
                        icon="mdi-cellphone"
                        size="20"
                        aria-hidden="true"
                      />
                      <v-icon
                        v-else
                        icon="mdi-monitor"
                        size="20"
                        aria-hidden="true"
                      />
                      <span class="github-project-detail__insight-platform">
                        {{
                          t(
                            `portfolio.githubProjects.insights.platform.${platform.key}`,
                          )
                        }}
                      </span>
                    </header>
                    <ul class="github-project-detail__insight-metrics">
                      <li
                        v-for="metric in insightMetrics"
                        :key="metric"
                      >
                        <span class="github-project-detail__insight-score">
                          {{ platform.scores[metric] ?? "—" }}
                        </span>
                        <span class="github-project-detail__insight-label">
                          {{
                            t(
                              `portfolio.githubProjects.insights.metrics.${metric}`,
                            )
                          }}
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </div>
            </article>
          </Motion>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <Motion
            :initial="{ opacity: 0, y: 28 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.55, ease: 'easeOut', delay: 0.15 }"
            :viewport="{ once: true, amount: 0.35 }"
          >
            <article class="github-project-detail__panel github-project-detail__panel--stats">
              <h2 class="github-project-detail__panel-title">
                {{ t("portfolio.githubProjects.statistics") }}
              </h2>
              <ul class="github-project-detail__stats">
                <li>
                  <v-icon
                    icon="mdi-star-outline"
                    size="18"
                    aria-hidden="true"
                  />
                  <div>
                    <span class="github-project-detail__stat-value">{{ project.stars }}</span>
                    <span class="github-project-detail__stat-label">{{
                      t("portfolio.githubProjects.stars")
                    }}</span>
                  </div>
                </li>
                <li>
                  <v-icon
                    icon="mdi-source-fork"
                    size="18"
                    aria-hidden="true"
                  />
                  <div>
                    <span class="github-project-detail__stat-value">{{ project.forks }}</span>
                    <span class="github-project-detail__stat-label">{{
                      t("portfolio.githubProjects.forks")
                    }}</span>
                  </div>
                </li>
                <li>
                  <v-icon
                    icon="mdi-alert-circle-outline"
                    size="18"
                    aria-hidden="true"
                  />
                  <div>
                    <span class="github-project-detail__stat-value">{{ project.openIssues }}</span>
                    <span class="github-project-detail__stat-label">{{
                      t("portfolio.githubProjects.openIssues")
                    }}</span>
                  </div>
                </li>
                <li>
                  <v-icon
                    icon="mdi-eye-outline"
                    size="18"
                    aria-hidden="true"
                  />
                  <div>
                    <span class="github-project-detail__stat-value">{{ project.watchers }}</span>
                    <span class="github-project-detail__stat-label">{{
                      t("portfolio.githubProjects.watchers")
                    }}</span>
                  </div>
                </li>
              </ul>
            </article>
          </Motion>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Motion } from "motion-v";
import { createError } from "#app";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import type {
  GithubProjectPerformance,
  GithubProjectPerformanceVariant,
} from "~/types/github";

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
  performance?: GithubProjectPerformance | null;
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

const insightMetrics = ["performance", "accessibility", "bestPractices", "seo"] as const;
type InsightPlatformKey = "mobile" | "desktop";

interface InsightPlatform {
  key: InsightPlatformKey;
  scores: GithubProjectPerformanceVariant;
}

const insightPlatforms = computed<InsightPlatform[]>(() => {
  const performance = project.value.performance;
  const platforms: InsightPlatform[] = [];

  if (!performance) {
    return platforms;
  }

  if (performance.mobile) {
    platforms.push({ key: "mobile", scores: performance.mobile });
  }

  if (performance.desktop) {
    platforms.push({ key: "desktop", scores: performance.desktop });
  }

  return platforms;
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
  gap: 32px;
}

.github-project-detail__back {
  align-self: flex-start;
  padding-left: 0;
}

.github-project-detail__hero {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 36px;
  border-radius: 32px;
  border: 1px solid hsl(var(--border) / 0.4);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(59, 130, 246, 0.18));
  overflow: hidden;
  box-shadow: 0 28px 60px -30px rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.github-project-detail__hero-glow {
  position: absolute;
  inset: -50% -10% auto;
  height: 240px;
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.4), transparent 65%);
  pointer-events: none;
}

.github-project-detail__description {
  margin: 0;
  max-width: 72ch;
}

.github-project-detail__hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.github-project-detail__hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.45);
  font-size: 0.85rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.github-project-detail__grid {
  margin-top: 12px;
}

.github-project-detail__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  padding: 32px;
  border-radius: 28px;
  border: 1px solid hsl(var(--border) / 0.4);
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.7), rgba(59, 130, 246, 0.15));
  box-shadow: 0 24px 50px -30px rgba(15, 23, 42, 0.5);
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}

.github-project-detail__panel::after {
  content: "";
  position: absolute;
  inset: -60% -20% auto;
  height: 200px;
  background: radial-gradient(circle at top, rgba(96, 165, 250, 0.25), transparent 70%);
  opacity: 0.8;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.github-project-detail__panel:hover,
.github-project-detail__panel:focus-within {
  transform: translateY(-6px);
  border-color: hsl(var(--primary) / 0.6);
  box-shadow: 0 32px 64px -28px rgba(59, 130, 246, 0.4);
}

.github-project-detail__panel:hover::after,
.github-project-detail__panel:focus-within::after {
  opacity: 1;
}

.github-project-detail__panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.github-project-detail__panel-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.github-project-detail__meta {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 16px;
}

.github-project-detail__meta > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.github-project-detail__meta dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(226, 232, 240, 0.75);
}

.github-project-detail__meta dd {
  margin: 0;
  font-size: 1rem;
}

.github-project-detail__link {
  color: inherit;
  text-decoration: none;
  position: relative;
}

.github-project-detail__link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.8), transparent);
}

.github-project-detail__topics,
.github-project-detail__languages {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.github-project-detail__section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.github-project-detail__topics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.github-project-detail__topic-wrapper {
  display: inline-flex;
}

.github-project-detail__topic {
  text-transform: none;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.45);
}

.github-project-detail__languages-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.github-project-detail__language-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.45);
  overflow: hidden;
}

.github-project-detail__language-item::before {
  content: "";
  position: absolute;
  inset: 0;
  width: var(--share-width);
  max-width: 100%;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.35), transparent 80%);
  opacity: 0.6;
  pointer-events: none;
}

.github-project-detail__language-item > span {
  position: relative;
  z-index: 1;
}

.github-project-detail__language-share {
  font-weight: 600;
}

.github-project-detail__insights {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.github-project-detail__insights-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
}

.github-project-detail__insights-heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 36rem;
}

.github-project-detail__insights-description {
  margin: 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: 0.95rem;
}

.github-project-detail__insights-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  font-size: 0.85rem;
  color: rgba(226, 232, 240, 0.7);
}

.github-project-detail__insights-updated {
  white-space: nowrap;
}

.github-project-detail__insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.github-project-detail__insight-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.55);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.github-project-detail__insight-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.github-project-detail__insight-card-header v-icon {
  color: hsl(var(--primary));
}

.github-project-detail__insight-platform {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
}

.github-project-detail__insight-metrics {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.github-project-detail__insight-metrics li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.github-project-detail__insight-score {
  min-width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0));
  border: 1px solid rgba(59, 130, 246, 0.45);
  box-shadow: 0 10px 24px -16px rgba(59, 130, 246, 0.6);
}

.github-project-detail__insight-label {
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.8);
}

.github-project-detail__panel--stats {
  gap: 20px;
}

.github-project-detail__stats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.github-project-detail__stats li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.github-project-detail__stats v-icon {
  color: hsl(var(--primary));
}

.github-project-detail__stat-value {
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
}

.github-project-detail__stat-label {
  display: block;
  font-size: 0.8rem;
  opacity: 0.75;
}

@media (max-width: 960px) {
  .github-project-detail__hero,
  .github-project-detail__panel {
    padding: 24px;
  }

  .github-project-detail__hero-meta {
    gap: 8px;
  }

  .github-project-detail__insights-meta {
    align-items: flex-start;
  }

  .github-project-detail__insights-updated {
    white-space: normal;
  }
}

@media (max-width: 600px) {
  .github-project-detail__hero-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
