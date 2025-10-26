<template>
  <section class="skill-detail">
    <v-container class="py-12 skill-detail__container">
      <v-btn
        variant="text"
        color="primary"
        class="text-none skill-detail__back"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        {{ t("portfolio.skills.backToCategory", { category: category?.name ?? "" }) }}
      </v-btn>

      <header class="skill-detail__header">
        <h1 class="text-h3 text-foreground">{{ skill?.name }}</h1>
        <p class="skill-detail__lead">
          {{ skill?.summary }}
        </p>
        <div class="skill-detail__meta">
          <div class="skill-detail__meta-item">
            <span class="skill-detail__meta-label">{{ t("portfolio.skills.levelLabel") }}</span>
            <span class="skill-detail__meta-value">{{ skill?.level }}</span>
          </div>
          <div class="skill-detail__meta-item">
            <span class="skill-detail__meta-label">{{ t("portfolio.skills.ratingLabel") }}</span>
            <v-rating
              :model-value="skill?.rating ?? 0"
              length="5"
              color="amber"
              size="30"
              readonly
              half-increments
              class="skill-detail__rating"
            />
          </div>
        </div>
      </header>

      <section class="skill-detail__projects">
        <h2 class="skill-detail__projects-title">
          {{ t("portfolio.skills.projectsHeading", { skill: skill?.name ?? "" }) }}
        </h2>
        <p class="skill-detail__projects-lead">
          {{ t("portfolio.skills.projectsDescription") }}
        </p>

        <div
          v-if="projects.length"
          class="skill-detail__project-list"
        >
          <v-card
            v-for="project in projects"
            :key="project.slug"
            class="skill-detail__project-card"
            variant="tonal"
            color="primary"
          >
            <div class="skill-detail__project-card-body">
              <div class="skill-detail__project-text">
                <h3 class="skill-detail__project-name">{{ project.name }}</h3>
                <p class="skill-detail__project-type">{{ project.type }}</p>
                <p class="skill-detail__project-summary">{{ project.description }}</p>
              </div>
              <v-btn
                :to="project.link"
                color="primary"
                variant="text"
                class="text-none"
                append-icon="mdi-arrow-top-right"
              >
                {{ t("portfolio.skills.viewProject") }}
              </v-btn>
            </div>
          </v-card>
        </div>
        <p
          v-else
          class="skill-detail__no-projects"
        >
          {{ t("portfolio.skills.noProjects") }}
        </p>
      </section>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { createError } from "#app";

import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

definePageMeta({
  i18n: {
    paths: {
      en: "/skills/[slug]/[skillSlug]",
      fr: "/competences/[slug]/[skillSlug]",
      de: "/kompetenzen/[slug]/[skillSlug]",
      es: "/habilidades/[slug]/[skillSlug]",
      it: "/competenze/[slug]/[skillSlug]",
      ru: "/navyki/[slug]/[skillSlug]",
      ar: "/maharat/[slug]/[skillSlug]",
    },
  },
});

const route = useRoute();
const categorySlug = computed(() => route.params.slug?.toString() ?? "");
const skillSlug = computed(() => route.params.skillSlug?.toString() ?? "");

if (!categorySlug.value || !skillSlug.value) {
  throw createError({ statusCode: 404, statusMessage: "Skill not found." });
}

const { data: skills } = await useContentBlock("skills");
const { data: work } = await useContentBlock("work");
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

const skillsContent = computed(() => skills.value);
const sectionLabel = computed(() => skillsContent.value?.label ?? "Skills");

const category = computed(() =>
  skillsContent.value?.categories.find((entry) => entry.slug === categorySlug.value),
);

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: "Skill not found." });
}

const skill = computed(() =>
  category.value?.skills.find((entry) => entry.slug === skillSlug.value),
);

if (!skill.value) {
  throw createError({ statusCode: 404, statusMessage: "Skill not found." });
}

const projectLookup = computed(() => {
  const projects = work.value?.works ?? [];
  return new Map(projects.map((project) => [project.slug, project]));
});

const projects = computed(() => {
  const currentSkill = skill.value;

  if (!currentSkill) {
    return [];
  }

  return currentSkill.projects
    .map(({ slug }) => {
      const project = projectLookup.value.get(slug);

      if (!project) {
        return null;
      }

      return {
        ...project,
        link: resolveLocalizedRouteTarget(`/work/${project.slug}`, localePath),
      };
    })
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
});

const categoryLink = computed(() =>
  resolveLocalizedRouteTarget(`/skills/${category.value?.slug ?? ""}`, localePath),
);

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back();
    return;
  }

  router.push(categoryLink.value);
}

useSeoMeta(() => ({
  title: `${skill.value?.name} · ${category.value?.name} · ${sectionLabel.value}`,
  description: skill.value?.summary ?? "",
}));
</script>

<style scoped>
.skill-detail__container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.skill-detail__back {
  align-self: flex-start;
  padding-left: 0;
}

.skill-detail__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-detail__lead {
  margin: 0;
  max-width: 760px;
  color: rgba(226, 232, 240, 0.82);
  font-size: 1.05rem;
  line-height: 1.8;
}

.skill-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.skill-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-detail__meta-label {
  font-weight: 600;
  color: rgba(226, 232, 240, 0.75);
}

.skill-detail__meta-value {
  font-weight: 600;
  color: #f8fafc;
}

.skill-detail__rating {
  --v-rating-background-opacity: 0.25;
}

.skill-detail__projects {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-detail__projects-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.94);
}

.skill-detail__projects-lead {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 640px;
  line-height: 1.6;
}

.skill-detail__project-list {
  display: grid;
  gap: 16px;
}

.skill-detail__project-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
}

.skill-detail__project-card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-detail__project-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #f8fafc;
}

.skill-detail__project-type {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.7);
}

.skill-detail__project-summary {
  margin: 12px 0 0;
  color: rgba(226, 232, 240, 0.85);
  line-height: 1.6;
}

.skill-detail__no-projects {
  margin: 0;
  color: rgba(148, 163, 184, 0.9);
  font-style: italic;
}

@media (max-width: 960px) {
  .skill-detail__container {
    gap: 24px;
  }
}
</style>
