<template>
  <section class="language-skills">
    <v-container class="language-skills__container">
      <v-btn
        :to="backLink"
        variant="text"
        color="primary"
        class="text-none language-skills__back"
        prepend-icon="mdi-arrow-left"
      >
        {{ t("portfolio.skills.backToOverview") }}
      </v-btn>

      <header class="language-skills__header">
        <h1 class="text-h3 text-foreground">{{ pageTitle }}</h1>
        <p class="language-skills__lead">
          {{ pageDescription }}
        </p>
      </header>

      <v-row
        v-if="hasLanguages"
        class="language-skills__grid"
        dense
      >
        <v-col
          v-for="language in languages"
          :key="language.name"
          cols="12"
          md="3"
        >
          <v-card
            variant="tonal"
            color="primary"
            class="language-card pa-6"
          >
            <header class="language-card__header">
              <h2 class="language-card__title">{{ language.name }}</h2>
              <span class="language-card__score">{{ language.proficiency }}%</span>
            </header>

            <v-progress-linear
              :model-value="language.proficiency"
              color="secondary"
              height="10"
              rounded
              class="language-card__progress"
            />

            <p class="language-card__description">
              {{
                t("portfolio.skills.languagesPage.proficiencyLabel", {
                  value: language.proficiency,
                })
              }}
            </p>
          </v-card>
        </v-col>
      </v-row>
      <v-alert
        v-else
        type="info"
        variant="tonal"
        color="primary"
        class="language-skills__empty"
      >
        {{ t("portfolio.skills.languagesPage.empty") }}
      </v-alert>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

definePageMeta({
  i18n: {
    paths: {
      en: "/skills/languages",
      fr: "/competences/langues",
      de: "/kompetenzen/sprachen",
      es: "/habilidades/idiomas",
      it: "/competenze/lingue",
      ru: "/navyki/yazyki",
      ar: "/maharat/lughat",
    },
  },
});

const { data: skills } = await useContentBlock("skills");
const { t } = useI18n();
const localePath = useLocalePath();

const skillsContent = computed(() => skills.value);
const languages = computed(() => {
  const entries = skillsContent.value?.languageProficiencies ?? [];

  return [...entries].sort((first, second) => second.proficiency - first.proficiency);
});

const hasLanguages = computed(() => languages.value.length > 0);
const pageTitle = computed(() => t("portfolio.skills.languagesPage.title"));
const pageDescription = computed(() => t("portfolio.skills.languagesPage.description"));
const backLink = computed(() => resolveLocalizedRouteTarget("/skills", localePath));

useSeoMeta(() => ({
  title: `${pageTitle.value} · ${skillsContent.value?.label ?? t("portfolio.skills.languagesTitle")}`,
  description: pageDescription.value,
}));
</script>

<style scoped>
.language-skills {
  position: relative;
  overflow: hidden;
}

.language-skills__container {
  max-width: 960px;
}

.language-skills__back {
  margin-bottom: 32px;
}

.language-skills__header {
  max-width: 640px;
  margin-bottom: 48px;
}

.language-skills__lead {
  margin: 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: 1.05rem;
  line-height: 1.6;
}

.language-skills__grid {
  row-gap: 24px;
}

.language-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(30, 41, 59, 0.6));
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 25px 60px -35px rgba(15, 23, 42, 0.85);
  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.language-card:hover {
  transform: translateY(-6px);
  border-color: rgba(129, 140, 248, 0.6);
  box-shadow: 0 32px 65px -40px rgba(99, 102, 241, 0.6);
}

.language-card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.language-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f8fafc;
}

.language-card__score {
  font-size: 1.25rem;
  font-weight: 600;
  color: #c7d2fe;
}

.language-card__progress {
  margin-bottom: 16px;
}

.language-card__description {
  margin: 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: 0.95rem;
}

.language-skills__empty {
  margin-top: 24px;
}

@media (max-width: 600px) {
  .language-skills__header {
    margin-bottom: 32px;
  }

  .language-card {
    padding: 24px;
  }

  .language-card__title {
    font-size: 1.25rem;
  }

  .language-card__score {
    font-size: 1.1rem;
  }
}
</style>
