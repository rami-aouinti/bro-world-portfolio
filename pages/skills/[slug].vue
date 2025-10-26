<template>
  <section class="skill-category">
    <v-container class="py-12 skill-category__container">
      <v-btn
        :to="backLink"
        variant="text"
        color="primary"
        class="text-none skill-category__back"
        prepend-icon="mdi-arrow-left"
      >
        {{ t("portfolio.skills.backToOverview") }}
      </v-btn>

      <header class="skill-category__header">
        <h1 class="text-h3 text-foreground">{{ category?.name }}</h1>
        <p class="skill-category__lead">
          {{ categoryDescription }}
        </p>
      </header>

      <v-row
        class="skill-category__grid"
        dense
      >
        <v-col
          v-for="entry in skillEntries"
          :key="entry.skill.slug"
          cols="12"
          md="6"
        >
          <v-card
            variant="flat"
            class="skill-card pa-6"
          >
            <header class="skill-card__header">
              <div>
                <NuxtLink
                  :to="entry.link"
                  class="skill-card__title"
                >
                  {{ entry.skill.name }}
                </NuxtLink>
                <p class="skill-card__level">
                  {{ t("portfolio.skills.levelLabel") }}
                  <span>{{ entry.skill.level }}</span>
                </p>
              </div>
              <v-rating
                :model-value="entry.skill.rating"
                length="5"
                color="amber"
                size="28"
                readonly
                half-increments
                class="skill-card__rating"
              />
            </header>

            <p class="skill-card__summary">
              {{ entry.skill.summary }}
            </p>

            <div class="skill-card__projects">
              <h3 class="skill-card__projects-title">
                {{ t("portfolio.skills.projectsTitle", { skill: entry.skill.name }) }}
              </h3>
              <div
                v-if="entry.projects.length"
                class="skill-card__project-list"
              >
                <v-chip
                  v-for="project in entry.projects"
                  :key="project.slug"
                  :to="project.link"
                  color="secondary"
                  variant="tonal"
                  class="skill-card__project-chip"
                  append-icon="mdi-arrow-top-right"
                >
                  {{ project.name }}
                </v-chip>
              </div>
              <p
                v-else
                class="skill-card__empty"
              >
                {{ t("portfolio.skills.noProjects") }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { createError } from "#app";

import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

definePageMeta({
  i18n: {
    paths: {
      en: "/skills/[slug]",
      fr: "/competences/[slug]",
      de: "/kompetenzen/[slug]",
      es: "/habilidades/[slug]",
      it: "/competenze/[slug]",
      ru: "/navyki/[slug]",
      ar: "/maharat/[slug]",
    },
  },
});

const route = useRoute();
const slug = computed(() => route.params.slug?.toString() ?? "");

if (!slug.value) {
  throw createError({ statusCode: 404, statusMessage: "Skill category not found." });
}

const { data: skills } = await useContentBlock("skills");
const { data: work } = await useContentBlock("work");
const { t } = useI18n();
const localePath = useLocalePath();

const skillsContent = computed(() => skills.value);
const sectionLabel = computed(() => skillsContent.value?.label ?? "Skills");
const backLink = computed(() => resolveLocalizedRouteTarget("/skills", localePath));

const category = computed(() =>
  skillsContent.value?.categories.find((entry) => entry.slug === slug.value),
);

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: "Skill category not found." });
}

const projectLookup = computed(() => {
  const projects = work.value?.works ?? [];
  return new Map(projects.map((project) => [project.slug, project]));
});

const skillEntries = computed(() => {
  const currentCategory = category.value;

  if (!currentCategory) {
    return [];
  }

  return currentCategory.skills.map((skill) => ({
    skill,
    link: resolveLocalizedRouteTarget(`/skills/${currentCategory.slug}/${skill.slug}`, localePath),
    projects: skill.projects
      .map(({ slug: projectSlug }) => {
        const project = projectLookup.value.get(projectSlug);

        if (!project) {
          return null;
        }

        return {
          ...project,
          link: resolveLocalizedRouteTarget(`/work/${project.slug}`, localePath),
        };
      })
      .filter((project): project is NonNullable<typeof project> => Boolean(project)),
  }));
});

const categoryDescription = computed(
  () => category.value?.description || skillsContent.value?.subline || "",
);

useSeoMeta(() => ({
  title: `${category.value?.name} · ${sectionLabel.value}`,
  description: categoryDescription.value,
}));
</script>

<style scoped>
.skill-category__container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.skill-category__back {
  align-self: flex-start;
  padding-left: 0;
}

.skill-category__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-category__lead {
  margin: 0;
  max-width: 720px;
  color: rgba(226, 232, 240, 0.78);
  font-size: 1.05rem;
  line-height: 1.7;
}

.skill-category__grid {
  margin-top: 8px;
}

.skill-card {
  height: 100%;
  position: relative;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 55%),
    radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.1), transparent 60%),
    linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.8));
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  backdrop-filter: blur(22px);
  box-shadow: 0 22px 45px -32px rgba(15, 23, 42, 0.85);
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow: hidden;
  transition:
    transform 0.45s ease,
    box-shadow 0.45s ease,
    border-color 0.45s ease,
    background 0.6s ease;
}

.skill-card::before {
  content: "";
  position: absolute;
  inset: -35% -15% auto -15%;
  height: 75%;
  background: conic-gradient(from 120deg at 30% 30%, rgba(129, 140, 248, 0.32), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.skill-card::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  pointer-events: none;
  transition: border-color 0.45s ease;
}

.skill-card:hover {
  transform: translateY(-12px);
  border-color: rgba(129, 140, 248, 0.55);
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.24), transparent 60%),
    radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.18), transparent 65%),
    linear-gradient(155deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.86));
  box-shadow: 0 34px 72px -28px rgba(59, 130, 246, 0.45);
}

.skill-card:hover::before {
  opacity: 1;
}

.skill-card:hover::after {
  border-color: rgba(129, 140, 248, 0.3);
}

.skill-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 12px;
  position: relative;
}

.skill-card__header::after {
  content: "";
  position: absolute;
  inset: auto 0 -12px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
  opacity: 0.6;
  transition: opacity 0.45s ease;
}

.skill-card:hover .skill-card__header::after {
  opacity: 1;
}

.skill-card__title {
  font-size: 1.45rem;
  font-weight: 600;
  color: #f8fafc;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition:
    color 0.35s ease,
    text-shadow 0.35s ease;
}

.skill-card__title:hover,
.skill-card__title:focus {
  text-decoration: underline;
  color: #c7d2fe;
  text-shadow: 0 8px 22px rgba(129, 140, 248, 0.4);
}

.skill-card__level {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.75);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.skill-card__level span {
  margin-left: 6px;
  font-weight: 600;
  color: #f8fafc;
}

.skill-card__rating {
  --v-rating-background-opacity: 0.25;
}

.skill-card__summary {
  margin: 0;
  color: rgba(226, 232, 240, 0.9);
  line-height: 1.65;
  font-size: 1rem;
}

.skill-card__projects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card__projects-title {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.88);
}

.skill-card__project-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-card__project-chip {
  text-transform: none;
  background: rgba(129, 140, 248, 0.16) !important;
  border: 1px solid rgba(129, 140, 248, 0.28) !important;
  color: #e0e7ff !important;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.skill-card__project-chip:hover {
  transform: translateY(-2px);
  background: rgba(99, 102, 241, 0.3) !important;
  border-color: rgba(165, 180, 252, 0.6) !important;
}

.skill-card__empty {
  margin: 0;
  color: rgba(148, 163, 184, 0.9);
  font-style: italic;
}

@media (max-width: 960px) {
  .skill-category__container {
    gap: 24px;
  }

  .skill-card__header {
    flex-direction: column;
  }

  .skill-card__rating {
    align-self: flex-start;
  }
}
</style>
