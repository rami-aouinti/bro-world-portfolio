<script setup lang="ts">
import { createError } from '#app'
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const route = useRoute()
const slug = computed(() => route.params.slug?.toString() ?? '')
const localePath = useLocalePath()

if (!slug.value) {
  throw createError({ statusCode: 404, statusMessage: 'Formation introuvable.' })
}

const { data: education } = await useContentBlock('education')

const sectionLabel = computed(() => education.value?.label ?? 'Formations')

const backLink = computed(() => resolveLocalizedRouteTarget('/education', localePath))

const schoolDetails = computed(() => {
  const entry = education.value?.schools.find((school) => school.slug === slug.value)

  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: 'Formation introuvable.' })
  }

  return entry
})

useSeoMeta(() => ({
  title: `${schoolDetails.value.degree} · ${sectionLabel.value}`,
  description: schoolDetails.value.details
}))
</script>

<template>
  <LayoutLine />
  <section class="detail-page">
    <v-container class="py-12 detail-page__container">
      <v-btn
        :to="backLink"
        variant="text"
        color="primary"
        class="text-none detail-page__back"
        prepend-icon="mdi-arrow-left"
      >
        Retour aux formations
      </v-btn>
      <div class="detail-page__header">
        <h1 class="text-h3 text-foreground mb-2">{{ schoolDetails.degree }}</h1>
        <p class="detail-page__lead">{{ schoolDetails.institution }}</p>
      </div>

      <div class="detail-page__meta">
        <div class="detail-page__meta-item">
          <span class="detail-page__meta-label">Institution</span>
          <span class="detail-page__meta-value">{{ schoolDetails.institution }}</span>
        </div>
        <div class="detail-page__meta-item">
          <span class="detail-page__meta-label">Période</span>
          <span class="detail-page__meta-value">{{ schoolDetails.timeframe }}</span>
        </div>
      </div>

      <v-card variant="tonal" color="primary" class="detail-page__card pa-6">
        <p class="detail-page__description">
          {{ schoolDetails.details }}
        </p>
      </v-card>
    </v-container>
  </section>
  <LayoutLine />
</template>

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

.detail-page__description {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(226, 232, 240, 0.85);
}
</style>
