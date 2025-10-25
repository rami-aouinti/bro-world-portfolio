<script setup lang="ts">
import { createError } from '#app'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

definePageMeta({
  i18n: {
    paths: {
      en: '/skills/[slug]',
      fr: '/competences/[slug]',
      de: '/kompetenzen/[slug]',
      es: '/habilidades/[slug]',
      it: '/competenze/[slug]',
      ru: '/navyki/[slug]',
      ar: '/maharat/[slug]'
    }
  }
})

const route = useRoute()
const slug = computed(() => route.params.slug?.toString() ?? '')

if (!slug.value) {
  throw createError({ statusCode: 404, statusMessage: 'Skill category not found.' })
}

const { data: skills } = await useContentBlock('skills')
const { data: work } = await useContentBlock('work')
const { t } = useI18n()
const localePath = useLocalePath()

const skillsContent = computed(() => skills.value)
const sectionLabel = computed(() => skillsContent.value?.label ?? 'Skills')
const backLink = computed(() => resolveLocalizedRouteTarget('/skills', localePath))

const category = computed(() => skillsContent.value?.categories.find((entry) => entry.slug === slug.value))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Skill category not found.' })
}

const projectLookup = computed(() => {
  const projects = work.value?.works ?? []
  return new Map(projects.map((project) => [project.slug, project]))
})

const skillEntries = computed(() => {
  const currentCategory = category.value

  if (!currentCategory) {
    return []
  }

  return currentCategory.skills.map((skill) => ({
    skill,
    link: resolveLocalizedRouteTarget(`/skills/${currentCategory.slug}/${skill.slug}`, localePath),
    projects: skill.projects
      .map(({ slug: projectSlug }) => {
        const project = projectLookup.value.get(projectSlug)

        if (!project) {
          return null
        }

        return {
          ...project,
          link: resolveLocalizedRouteTarget(`/work/${project.slug}`, localePath)
        }
      })
      .filter((project): project is NonNullable<typeof project> => Boolean(project))
  }))
})

const categoryDescription = computed(
  () => category.value?.description || skillsContent.value?.subline || ''
)

useSeoMeta(() => ({
  title: `${category.value?.name} · ${sectionLabel.value}`,
  description: categoryDescription.value
}))
</script>

<template>
  <LayoutLine />
  <section class="skill-category">
    <v-container class="py-12 skill-category__container">
      <v-btn
        :to="backLink"
        variant="text"
        color="primary"
        class="text-none skill-category__back"
        prepend-icon="mdi-arrow-left"
      >
        {{ t('portfolio.skills.backToOverview') }}
      </v-btn>

      <header class="skill-category__header">
        <h1 class="text-h3 text-foreground">{{ category?.name }}</h1>
        <p class="skill-category__lead">
          {{ categoryDescription }}
        </p>
      </header>

      <v-row class="skill-category__grid" dense>
        <v-col v-for="entry in skillEntries" :key="entry.skill.slug" cols="12" md="6">
          <v-card variant="tonal" color="primary" class="skill-card pa-6">
            <header class="skill-card__header">
              <div>
                <NuxtLink :to="entry.link" class="skill-card__title">
                  {{ entry.skill.name }}
                </NuxtLink>
                <p class="skill-card__level">
                  {{ t('portfolio.skills.levelLabel') }}
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
                {{ t('portfolio.skills.projectsTitle', { skill: entry.skill.name }) }}
              </h3>
              <div v-if="entry.projects.length" class="skill-card__project-list">
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
              <p v-else class="skill-card__empty">
                {{ t('portfolio.skills.noProjects') }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
  <LayoutLine />
</template>

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
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.58));
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow: hidden;
  transition: transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
}

.skill-card::before {
  content: "";
  position: absolute;
  inset: -40% -20%;
  background: radial-gradient(circle at var(--glow-x, 30%) 30%, rgba(99, 102, 241, 0.18), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.skill-card:hover {
  transform: translateY(-10px);
  border-color: rgba(129, 140, 248, 0.45);
  box-shadow: 0 38px 70px -45px rgba(79, 70, 229, 0.55);
}

.skill-card:hover::before {
  opacity: 1;
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
  font-size: 1.4rem;
  font-weight: 600;
  color: #f8fafc;
  text-decoration: none;
  transition: color 0.35s ease;
}

.skill-card__title:hover,
.skill-card__title:focus {
  text-decoration: underline;
  color: #c7d2fe;
}

.skill-card__level {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.95rem;
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
  color: rgba(226, 232, 240, 0.86);
  line-height: 1.6;
  font-size: 0.98rem;
}

.skill-card__projects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-card__projects-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.9);
}

.skill-card__project-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-card__project-chip {
  text-transform: none;
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
