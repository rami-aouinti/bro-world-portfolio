<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

type RawLanguageEntry =
  | string
  | {
      label: string
      icon?: string | null
      code?: string | null
    }

type DisplayLanguage = {
  label: string
  icon?: string
}

const LANGUAGE_FLAG_MAP: Partial<Record<string, string>> = {
  english: "fi-gb gb",
  en: "fi-gb gb",
  french: "fi-fr fr",
  francais: "fi-fr fr",
  français: "fi-fr fr",
  fr: "fi-fr fr",
  german: "fi-de de",
  deutsch: "fi-de de",
  allemand: "fi-de de",
  de: "fi-de de",
  spanish: "fi-es es",
  espanol: "fi-es es",
  español: "fi-es es",
  es: "fi-es es",
  italian: "fi-it it",
  italiano: "fi-it it",
  it: "fi-it it",
  russian: "fi-ru ru",
  русский: "fi-ru ru",
  ru: "fi-ru ru",
  arabic: "fi-tn tn",
  arabe: "fi-tn tn",
  العربية: "fi-tn tn",
  ar: "fi-tn tn",
  anglais: "fi-gb gb",
} as const

function normaliseKey(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  return value
    .toString()
    .trim()
    .toLowerCase()
}

function resolveLanguageIcon(language: RawLanguageEntry): DisplayLanguage {
  if (typeof language === 'string') {
    const icon = LANGUAGE_FLAG_MAP[normaliseKey(language) ?? '']

    return {
      label: language,
      icon,
    }
  }

  const fallbackKey = normaliseKey(language.code) ?? normaliseKey(language.label)
  const iconFromMap = fallbackKey ? LANGUAGE_FLAG_MAP[fallbackKey] : undefined
  const providedIcon = language.icon?.trim() ?? ''
  const icon = providedIcon.length ? providedIcon : iconFromMap

  return {
    label: language.label,
    icon: icon ?? undefined,
  }
}

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
  const languageProficiencies = skillsContent.value?.languageProficiencies ?? []
  const resolvedLanguages = languages.length
    ? languages
    : languageProficiencies.map((entry) => entry.name)

  if (!resolvedLanguages.length) {
    return null
  }

  const variantIndex = skillCards.value.length % glowCardVariantCycle.length

  return {
    variant: glowCardVariantCycle[variantIndex],
    badge: t('portfolio.skills.languagesBadge', resolvedLanguages.length, { count: resolvedLanguages.length }),
    languages: resolvedLanguages,
    link: resolveLocalizedRouteTarget('/skills/languages', localePath),
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
              <div class="skills__card">
                <v-chip
                    v-for="(skill, skillIndex) in card.skills"
                    :key="skill.slug"
                    class="skills__chip"
                    color="primary"
                    variant="tonal"
                    size="small"
                >
                  <NuxtLink :to="skill.link">
                    {{ skill.name }}
                  </NuxtLink>
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
              :to="languageCard.link"
            >
              <div class="skills__chips">
                <v-chip
                  v-for="language in languageCard.languages"
                  :key="language.label"
                  class="skills__chip skills__language-chip"
                  color="primary"
                  variant="tonal"
                  size="small"
                >
                  <span
                    v-if="language.icon"
                    class="skills__language-flag"
                    aria-hidden="true"
                  >
                    <span class="fi" :class="language.icon" />
                  </span>
                  <span class="skills__language-label">{{ language.label }}</span>
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
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(30, 41, 59, 0.4));
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

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skills__chip {
  text-transform: none;
}

.skills__language-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.skills__language-flag {
  display: inline-flex;
  align-items: center;
}

.skills__language-flag .fi {
  width: 18px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.25);
}

.skills__language-label {
  display: inline-flex;
  align-items: center;
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
