<template>
  <section class="github-projects">
    <v-container class="py-12 github-projects__container">
      <header class="github-projects__header">
        <h1 class="text-h4 text-foreground github-projects__title">
          {{ t("portfolio.githubProjects.title") }}
        </h1>
        <p class="text-body-1 text-muted-foreground github-projects__lead">
          {{ t("portfolio.githubProjects.description") }}
        </p>
      </header>

      <div
        v-if="status === 'pending'"
        class="github-projects__loading"
      >
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
            v-for="(project, index) in projectsWithHighlights"
            :key="project.slug"
            cols="12"
            md="6"
            lg="6"
          >
            <Motion
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }"
              :viewport="{ once: true, amount: 0.4 }"
            >
              <article
                class="github-projects__card"
                :aria-labelledby="`project-${project.slug}`"
              >
                <span
                  class="github-projects__card-glow"
                  aria-hidden="true"
                />

                <header class="github-projects__card-header">
                  <div class="github-projects__card-heading">
                    <h2
                      :id="`project-${project.slug}`"
                      class="github-projects__card-title"
                    >
                      {{ project.name }}
                    </h2>
                    <p class="github-projects__card-subtitle">
                      {{ formatDate(project.updatedAt) }} ·
                      {{ project.primaryLanguage ?? t("portfolio.githubProjects.languageUnknown") }}
                    </p>
                  </div>

                  <span
                    v-if="project.primaryLanguage"
                    class="github-projects__language"
                  >
                    {{ project.primaryLanguage }}
                  </span>
                </header>

                <ul class="github-projects__stats">
                  <li>
                    <v-icon
                      icon="mdi-star-outline"
                      size="18"
                      class="github-projects__stat-icon"
                      aria-hidden="true"
                    />
                    <div class="github-projects__stat-text">
                      <span class="github-projects__stat-value">{{ project.stars }}</span>
                      <span class="github-projects__stat-label">{{
                        t("portfolio.githubProjects.stars")
                      }}</span>
                    </div>
                  </li>
                  <li>
                    <v-icon
                      icon="mdi-source-fork"
                      size="18"
                      class="github-projects__stat-icon"
                      aria-hidden="true"
                    />
                    <div class="github-projects__stat-text">
                      <span class="github-projects__stat-value">{{ project.forks }}</span>
                      <span class="github-projects__stat-label">{{
                        t("portfolio.githubProjects.forks")
                      }}</span>
                    </div>
                  </li>
                  <li>
                    <v-icon
                      icon="mdi-clock-outline"
                      size="18"
                      class="github-projects__stat-icon"
                      aria-hidden="true"
                    />
                    <div class="github-projects__stat-text">
                      <span class="github-projects__stat-value">{{
                        formatDate(project.updatedAt)
                      }}</span>
                      <span class="github-projects__stat-label">{{
                        t("portfolio.githubProjects.updatedAt")
                      }}</span>
                    </div>
                  </li>
                </ul>

                <div
                  v-if="project.displayTopics.length"
                  class="github-projects__topics"
                >
                  <Motion
                    v-for="(topic, topicIndex) in project.displayTopics"
                    :key="topic"
                    as="div"
                    class="github-projects__topic-motion"
                    :initial="{ opacity: 0, y: 12 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.35, delay: 0.15 + topicIndex * 0.05 }"
                    :viewport="{ once: true }"
                  >
                    <v-chip
                      label
                      size="small"
                      class="github-projects__topic"
                      variant="outlined"
                    >
                      #{{ topic }}
                    </v-chip>
                  </Motion>
                  <span
                    v-if="project.hiddenTopics > 0"
                    class="github-projects__topic github-projects__topic--more"
                  >
                    +{{ project.hiddenTopics }}
                  </span>
                </div>

                <footer class="github-projects__actions">
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
                </footer>
              </article>
            </Motion>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Motion } from "motion-v";
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

const projectsWithHighlights = computed(() =>
  projects.value.map((project) => {
    const displayTopics = project.topics.slice(0, 4);
    const hiddenTopics = Math.max(project.topics.length - displayTopics.length, 0);

    return {
      ...project,
      displayTopics,
      hiddenTopics,
    };
  }),
);

function projectDetailRoute(slug: string) {
  return localePath({ name: "projects-slug", params: { slug } });
}

function formatDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return input;
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  padding: 28px;
  border-radius: 28px;
  border: 1px solid hsl(var(--border) / 0.35);
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.18), rgba(14, 165, 233, 0.08));
  background-color: hsl(var(--muted) / 0.12);
  box-shadow: 0 24px 45px -32px rgba(15, 23, 42, 0.55);
  overflow: hidden;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}

.github-projects__card:hover,
.github-projects__card:focus-within {
  transform: translateY(-6px);
  border-color: hsl(var(--primary) / 0.6);
  box-shadow: 0 32px 60px -28px rgba(59, 130, 246, 0.45);
}

.github-projects__card-glow {
  position: absolute;
  inset: -40% -20% auto;
  height: 180px;
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.35), transparent 70%);
  opacity: 0.7;
  transition: opacity 0.4s ease;
}

.github-projects__card:hover .github-projects__card-glow,
.github-projects__card:focus-within .github-projects__card-glow {
  opacity: 1;
}

.github-projects__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.github-projects__card-heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.github-projects__card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.github-projects__card-subtitle {
  font-size: 0.85rem;
  opacity: 0.75;
  margin: 0;
}

.github-projects__language {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(226, 232, 240, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.45);
}

.github-projects__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
}

.github-projects__stats li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.25);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.github-projects__stat-icon {
  color: hsl(var(--primary));
}

.github-projects__stat-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
}

.github-projects__stat-value {
  font-weight: 600;
}

.github-projects__stat-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.github-projects__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.github-projects__topic-motion {
  display: inline-flex;
}

.github-projects__topic {
  text-transform: none;
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.35);
  color: inherit;
}

.github-projects__topic--more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: rgba(15, 23, 42, 0.35);
  border: 1px dashed rgba(148, 163, 184, 0.4);
}

.github-projects__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

@media (max-width: 1280px) {
  .github-projects__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .github-projects__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
