<template>
  <section id="skills">
    <ScrollSmooth>
      <v-container
        v-if="skillsContent"
        class="mt-2 text-center"
      >
        <BlurReveal
          :delay="0.5"
          :duration="0.75"
          class="p-8"
        >
          <h2 class="text-h4 text-foreground">{{ skillsContent.headline }}</h2>
          <p class="text-body-1 text-foreground mt-4">
            {{ skillsContent.subline }}
          </p>
        </BlurReveal>

        <v-row
          class="mt-10"
          dense
        >
          <v-col
            v-for="card in skillCards"
            :key="card.category.name"
            cols="12"
            md="4"
          >
            <CustomGlowCard
              class="skills__card"
              :title="card.category.name"
              :variant="card.variant"
              :badge="card.badge"
              :description="card.description"
              :to="card.link"
              padding="clamp(22px, 3vw, 28px)"
              border-radius="26px"
              outline-color="rgba(148, 163, 184, 0.18)"
              :gradient-sheen-angle="140"
              :gradient-sheen-opacity="0.55"
            >
              <div class="skills__chips">
                <v-chip
                  v-for="skill in card.skills"
                  :key="skill.slug"
                  class="skills__chip"
                  color="primary"
                  variant="tonal"
                >
                  <NuxtLink :to="skill.link">
                    {{ skill.name }}
                  </NuxtLink>
                </v-chip>
              </div>
            </CustomGlowCard>
          </v-col>
          <v-col
            v-if="languageCard"
            cols="12"
            md="4"
          >
            <CustomGlowCard
              class="skills__card"
              :title="t('portfolio.skills.languagesTitle')"
              :variant="languageCard.variant"
              :badge="languageCard.badge"
              :description="t('portfolio.skills.languagesDescription')"
              :to="languageCard.link"
              padding="clamp(22px, 3vw, 28px)"
              border-radius="26px"
              outline-color="rgba(148, 163, 184, 0.18)"
              :gradient-sheen-angle="140"
              :gradient-sheen-opacity="0.55"
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
                    <span
                      class="fi"
                      :class="language.icon"
                    />
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

<script setup lang="ts">
import { computed } from "vue";

import CustomGlowCard from "~/components/CustomGlowCard.vue";
import { glowCardVariantCycle } from "~/utils/glowCardVariants";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import { BlurReveal } from "~/components/ui/blur-reveal";

type RawLanguageEntry =
  | string
  | {
      label: string;
      icon?: string | null;
      code?: string | null;
    };

type DisplayLanguage = {
  label: string;
  icon?: string;
};

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
} as const;

function normaliseKey(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.toString().trim().toLowerCase();
}

function resolveLanguageIcon(language: RawLanguageEntry): DisplayLanguage {
  if (typeof language === "string") {
    const icon = LANGUAGE_FLAG_MAP[normaliseKey(language) ?? ""];

    return {
      label: language,
      icon,
    };
  }

  const fallbackKey = normaliseKey(language.code) ?? normaliseKey(language.label);
  const iconFromMap = fallbackKey ? LANGUAGE_FLAG_MAP[fallbackKey] : undefined;
  const providedIcon = language.icon?.trim() ?? "";
  const icon = providedIcon.length ? providedIcon : iconFromMap;

  return {
    label: language.label,
    icon: icon ?? undefined,
  };
}

const { data: skills } = useContentBlock("skills");
const { t } = useI18n();
const localePath = useLocalePath();

const skillsContent = computed(() => skills.value);
const skillCards = computed(() => {
  const categories = skillsContent.value?.categories ?? [];
  const fallbackDescription = t("portfolio.skills.cardDescription");

  return categories.map((category, index) => ({
    category,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
    badge: t("portfolio.skills.badge", category.skills.length, { count: category.skills.length }),
    description: category.description || fallbackDescription,
    link: resolveLocalizedRouteTarget(`/skills/${category.slug}`, localePath),
    skills: category.skills.map((skill) => ({
      ...skill,
      link: resolveLocalizedRouteTarget(`/skills/${category.slug}/${skill.slug}`, localePath),
    })),
  }));
});

const languageCard = computed(() => {
  const languages = skillsContent.value?.languages ?? [];
  const languageProficiencies = skillsContent.value?.languageProficiencies ?? [];
  const resolvedLanguages: RawLanguageEntry[] = languages.length
    ? languages
    : languageProficiencies.map((entry) => entry.name);
  const displayLanguages = resolvedLanguages.map((entry) => resolveLanguageIcon(entry));

  if (!displayLanguages.length) {
    return null;
  }

  const variantIndex = skillCards.value.length % glowCardVariantCycle.length;

  return {
    variant: glowCardVariantCycle[variantIndex],
    badge: t("portfolio.skills.languagesBadge", displayLanguages.length, {
      count: displayLanguages.length,
    }),
    languages: displayLanguages,
    link: resolveLocalizedRouteTarget("/skills/languages", localePath),
  };
});
</script>

<style scoped>

.skills__card {
  height: 100%;
}

.skills__card :deep(.glow-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.skills__card :deep(.glow-card__body) {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

@media (min-width: 960px) {
  .skills__chips {
    justify-content: flex-start;
  }
}


.skills__chip {
  text-transform: none;
  min-height: 44px;
  padding-inline: 12px;
  text-decoration: none;
}

.skills__chip :deep(.v-chip__content) {
  min-height: 44px;
  padding: 0;
}

.skills__chip :deep(a) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  padding-inline: 4px;
  text-decoration: none;
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
