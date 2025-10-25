<template>
  <section class="detail-page">
    <v-container class="py-12 detail-page__container">
      <v-btn
        variant="text"
        color="primary"
        class="text-none detail-page__back"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        Go back
      </v-btn>
      <div class="detail-page__header">
        <h1 class="text-h3 text-foreground mb-2">{{ experienceDetails.role }}</h1>
        <p class="detail-page__lead">{{ experienceDetails.company }}</p>
      </div>

      <div class="detail-page__meta">
        <div class="detail-page__meta-item">
          <span class="detail-page__meta-label">Entreprise</span>
          <span class="detail-page__meta-value">{{ experienceDetails.company }}</span>
        </div>
        <div class="detail-page__meta-item">
          <span class="detail-page__meta-label">Période</span>
          <span class="detail-page__meta-value">{{ experienceDetails.timeframe }}</span>
        </div>
      </div>

      <v-card
        variant="tonal"
        color="primary"
        class="detail-page__card pa-6"
      >
        <h2 class="text-h6 text-foreground mb-4">Principales réalisations</h2>
        <ul class="detail-page__list">
          <li
            v-for="achievement in experienceDetails.achievements"
            :key="achievement"
            class="detail-page__list-item"
          >
            <v-icon
              icon="mdi-check-circle-outline"
              size="20"
              class="detail-page__icon"
            />
            <span>{{ achievement }}</span>
          </li>
        </ul>
      </v-card>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { createError } from "#app";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

const route = useRoute();
const slug = computed(() => route.params.slug?.toString() ?? "");
const localePath = useLocalePath();
const router = useRouter();

if (!slug.value) {
  throw createError({ statusCode: 404, statusMessage: "Expérience introuvable." });
}

const { data: experiences } = await useContentBlock("experiences");

const sectionLabel = computed(() => experiences.value?.label ?? "Expériences");

const backLink = computed(() => resolveLocalizedRouteTarget("/experience", localePath));

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back();
    return;
  }

  router.push(backLink.value);
};

const experienceDetails = computed(() => {
  const entry = experiences.value?.positions.find((position) => position.slug === slug.value);

  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: "Expérience introuvable." });
  }

  return entry;
});

useSeoMeta(() => ({
  title: `${experienceDetails.value.role} · ${sectionLabel.value}`,
  description: experienceDetails.value.achievements[0],
}));
</script>

<style scoped>
.detail-page__container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-page__back {
  align-self: flex-start;
  padding-left: 0;
}

.detail-page__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-page__lead {
  font-size: 1.05rem;
  color: rgba(226, 232, 240, 0.8);
}

.detail-page__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.detail-page__meta-item {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  min-width: 200px;
}

.detail-page__meta-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.75);
}

.detail-page__meta-value {
  font-size: 1rem;
  color: rgba(226, 232, 240, 0.95);
}

.detail-page__card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
}

.detail-page__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.detail-page__list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(226, 232, 240, 0.85);
}

.detail-page__icon {
  color: rgba(129, 140, 248, 0.85);
  margin-top: 4px;
}
</style>
