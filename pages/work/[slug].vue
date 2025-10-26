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
        Go to projects
      </v-btn>

      <div class="detail-page__header">
        <h1 class="text-h3 text-foreground mb-2">{{ projectDetails.name }}</h1>
        <p class="detail-page__lead">{{ projectDetails.type }}</p>
      </div>

      <v-row
        class="detail-page__grid"
        align="stretch"
        dense
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            variant="tonal"
            color="primary"
            class="detail-page__card pa-6"
          >
            <p class="detail-page__description">
              {{ projectDetails.description }}
            </p>
            <div class="detail-page__actions">
              <v-btn
                :href="projectDetails.live_demo"
                target="_blank"
                rel="noopener"
                color="primary"
                class="text-none"
                append-icon="mdi-open-in-new"
              >
                Voir la démo en ligne
              </v-btn>
            </div>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <NuxtImg
            :src="projectThumbnailSrc"
            :alt="`Illustration du projet ${projectDetails.name}`"
            densities="[1,2]"
            class="detail-page__image"
            format="webp"
            width="960"
            height="640"
            sizes="(min-width: 1280px) 480px, (min-width: 960px) 50vw, 100vw"
            placeholder="blur"
            preload
            loading="eager"
            fetchpriority="high"
          />
        </v-col>
      </v-row>
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
  throw createError({ statusCode: 404, statusMessage: "Projet introuvable." });
}

const { data: work } = await useContentBlock("work");

const sectionLabel = computed(() => work.value?.label ?? "Projets");

const backLink = computed(() => resolveLocalizedRouteTarget("/work", localePath));

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back();
    return;
  }

  router.push(backLink.value);
}

const projectDetails = computed(() => {
  const entry = work.value?.works.find((item) => item.slug === slug.value);

  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: "Projet introuvable." });
  }

  return entry;
});

const projectThumbnailSrc = computed(() => `/images/work/${projectDetails.value.thumbnails}`);

useSeoMeta(() => ({
  title: `${projectDetails.value.name} · ${sectionLabel.value}`,
  description: projectDetails.value.description,
  ogImage: projectThumbnailSrc.value,
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

.detail-page__card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  height: 100%;
}

.detail-page__description {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(226, 232, 240, 0.85);
}

.detail-page__actions {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.detail-page__grid {
  margin-top: 8px;
}

.detail-page__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  object-fit: cover;
}
</style>
