<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: skills } = useContentBlock('skills')
const { t } = useI18n()
const localePath = useLocalePath()

const skillsContent = computed(() => skills.value)
const skillCards = computed(() => {
  const categories = skillsContent.value?.categories ?? []
  const fallbackDescription = t('portfolio.skills.cardDescription')

  return categories.map((category, index) => ({
    category,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
    badge: t('portfolio.skills.badge', category.skills.length, { count: category.skills.length }),
    description: category.description || fallbackDescription,
    link: resolveLocalizedRouteTarget(`/skills/${category.slug}`, localePath),
    skills: category.skills.map((skill) => ({
      ...skill,
      link: resolveLocalizedRouteTarget(`/skills/${category.slug}/${skill.slug}`, localePath)
    })),
  }))
})

const languageCard = computed(() => {
  const languages = skillsContent.value?.languages ?? []

  if (!languages.length) {
    return null
  }

  const variantIndex = skillCards.value.length % glowCardVariantCycle.length

  return {
    variant: glowCardVariantCycle[variantIndex],
    badge: t('portfolio.skills.languagesBadge', languages.length, { count: languages.length }),
    languages,
  }
})
</script>

<template>
  <section id="skills">
    <ScrollSmooth>
      <v-container v-if="skillsContent" class="mt-10">
        <h2 class="text-h4 text-foreground">{{ skillsContent.headline }}</h2>
        <p class="text-body-1 text-foreground mt-4" style="max-width: 600px;">
          {{ skillsContent.subline }}
        </p>

        <v-row class="mt-10" dense>
          <v-col v-for="card in skillCards" :key="card.category.name" cols="12" md="4">
            <CustomGlowCard
              class="skills__card"
              :title="card.category.name"
              :variant="card.variant"
              :badge="card.badge"
              :description="card.description"
              :to="card.link"
            >
              <ul class="skills__list">
                <li
                  v-for="(skill, skillIndex) in card.skills"
                  :key="skill.slug"
                  class="skills__item"
                  :style="{ '--skill-delay': `${skillIndex * 60}ms` }"
                >
                  <div class="skills__item-header">
                    <NuxtLink :to="skill.link" class="skills__item-name">
                      {{ skill.name }}
                    </NuxtLink>
                    <div class="skills__item-meta">
                      <span class="skills__item-level">{{ skill.level }}</span>
                      <v-rating
                        :model-value="skill.rating"
                        length="5"
                        color="amber"
                        density="compact"
                        size="18"
                        half-increments
                        readonly
                        class="skills__item-rating"
                      />
                    </div>
                  </div>
                  <p v-if="skill.summary" class="skills__item-summary">
                    {{ skill.summary }}
                  </p>
                </li>
              </ul>
            </CustomGlowCard>
          </v-col>
          <v-col v-if="languageCard" cols="12" md="4">
            <CustomGlowCard
              class="skills__card"
              :title="t('portfolio.skills.languagesTitle')"
              :variant="languageCard.variant"
              :badge="languageCard.badge"
              :description="t('portfolio.skills.languagesDescription')"
            >
              <div class="skills__chips">
                <v-chip
                  v-for="language in languageCard.languages"
                  :key="language"
                  class="skills__chip"
                  color="primary"
                  variant="tonal"
                  size="small"
                >
                  {{ language }}
                </v-chip>
              </div>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.skills__card {
  height: 100%;
  position: relative;
  overflow: visible;
  transition: transform 0.45s ease, box-shadow 0.45s ease;
}

.skills__card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 65px -40px rgba(15, 23, 42, 0.9);
}

.skills__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skills__item {
  --skill-delay: 0ms;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.45));
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.8);
  animation: skills-item-fade 0.6s ease both;
  animation-delay: var(--skill-delay);
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.skills__item:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.55);
  box-shadow: 0 22px 40px -28px rgba(129, 140, 248, 0.55);
}

.skills__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.skills__item-name {
  font-weight: 600;
  font-size: 1.05rem;
  color: #f8fafc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.skills__item-name:hover,
.skills__item-name:focus-visible {
  color: #c7d2fe;
  text-decoration: underline;
}

.skills__item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.skills__item-level {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.15);
  color: rgba(224, 231, 255, 0.95);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.skills__item-rating {
  --v-rating-background-opacity: 0.2;
}

.skills__item-summary {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  font-size: 0.92rem;
  line-height: 1.65;
}

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skills__chip {
  text-transform: none;
}

@media (max-width: 1280px) {
  .skills__item-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .skills__item-meta {
    width: 100%;
    justify-content: space-between;
  }
}

@keyframes skills-item-fade {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
