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
              <div class="skills__chips">
                <v-chip
                  v-for="skill in card.skills"
                  :key="skill.slug"
                  class="skills__chip"
                  color="primary"
                  variant="tonal"
                  size="small"
                  :to="skill.link"
                  append-icon="mdi-arrow-top-right"
                >
                  {{ skill.name }}
                </v-chip>
              </div>
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
}

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skills__chip {
  text-transform: none;
}
</style>
