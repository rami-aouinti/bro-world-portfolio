<template>
  <section
    id="work"
    class="work-section"
  >
    <ScrollSmooth>
      <v-container
        v-if="content"
        class="mt-2 text-center"
      >
        <BlurReveal
          :delay="0.5"
          :duration="0.75"
          class="p-8"
        >
          <h2 class="text-h4 text-foreground">{{ content.headline }}</h2>
          <p class="text-body-1 text-foreground mt-4">
            {{ content.subline }}
          </p>
        </BlurReveal>
        <v-row
          class="mt-12"
          dense
        >
          <v-col
            v-for="card in workCards"
            :key="card.item.slug"
            cols="12"
            md="4"
            class="gap-3"
          >
            <CardContainer>
              <CardBody class="work-card-body">
                <NuxtLink
                  :to="card.route"
                  class="work-card-thumbnail"
                  :aria-label="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                >
                  <NuxtImg
                    :src="`/images/work/${card.item.thumbnails}`"
                    :alt="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                    width="1000"
                    height="320"
                    sizes="(min-width: 1280px) 320px, (min-width: 960px) 33vw, (min-width: 600px) 50vw, 90vw"
                    densities="1x, 2x"
                    class="work-card-thumbnail-image"
                    loading="lazy"
                  />
                </NuxtLink>
                <div class="work-card-content relative z-10 flex h-full flex-col gap-5">
                  <div class="flex flex-col gap-3">
                    <CardItem
                      as="span"
                      :translate-z="40"
                      class="work-card-badge"
                    >
                      {{ card.item.type }}
                    </CardItem>
                    <CardItem
                      as="h3"
                      :translate-z="55"
                      class="text-2xl font-semibold text-foreground"
                    >
                      {{ card.item.name }}
                    </CardItem>
                  </div>
                  <CardItem
                    as="div"
                    :translate-z="25"
                    class="mt-auto flex items-center justify-between gap-4 pt-4"
                  >
                    <span class="work-card-footer-label">
                      {{ t("portfolio.work.footerLabel") }}
                    </span>
                    <v-btn
                      :to="card.item.live_demo"
                      target="_blank"
                      color="primary"
                      variant="text"
                      class="text-none"
                      @click.stop
                      @keydown.stop
                    >
                      {{ t("portfolio.work.liveDemo") }}
                    </v-btn>
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import { CardBody, CardContainer, CardItem } from "~/components/ui/card-3d";
import { BlurReveal } from "~/components/ui/blur-reveal";

const { data: work } = useContentBlock("work");
const { t } = useI18n();
const localePath = useLocalePath();
const content = computed(() => work.value);
const workCards = computed(() => {
  const items = content.value?.works ?? [];

  return items.map((item) => ({
    item,
    route: resolveLocalizedRouteTarget(`/work/${item.slug}`, localePath),
  }));
});
</script>

<style scoped>
@reference "../../assets/styles/index.css";

.work-section {
  padding-block: clamp(56px, 12vw, 112px);
}

.work-section :deep(.v-container) {
  padding-inline: clamp(18px, 6vw, 64px);
}

.work-section :deep(.v-row) {
  row-gap: clamp(18px, 4vw, 32px);
}
.work-card-body {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  border-radius: 28px;
  border: 1px solid;
  padding: 2.5rem;
  box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-color: hsl(var(--border) / 0.4);
  background-color: rgba(var(--v-theme-primary), 0.65);
}

.work-card-thumbnail {
  display: block;
  overflow: hidden;
  border-radius: 1.25rem;
}

.work-card-thumbnail-image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 3;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.work-card-thumbnail:focus-visible .work-card-thumbnail-image,
.work-card-thumbnail:hover .work-card-thumbnail-image {
  transform: scale(1.03);
}

.work-card-content {
  flex: 1;
}

.work-card-media {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid;
  min-height: 220px;
  box-shadow: 0 20px 45px -35px rgba(15, 23, 42, 0.75);
  border-color: hsl(var(--border) / 0.4);
  background-color: hsl(var(--background) / 0.35);
}

.work-card-image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.work-card-badge {
  width: fit-content;
  border-radius: 9999px;
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
}

.work-card-footer-label {
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: hsl(var(--muted-foreground));
}

@media (max-width: 1280px) {
  .work-card-body {
    padding: 2.25rem;
  }
}

@media (max-width: 960px) {
  .work-card-body {
    min-height: unset;
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  .work-section :deep(.v-container) {
    padding-inline: 1.25rem;
  }

  .work-card-body {
    padding: 1.5rem;
    border-radius: 24px;
  }

  .work-card-thumbnail-image {
    aspect-ratio: 16 / 9;
  }

  .work-card-footer-label {
    font-size: 0.7rem;
    letter-spacing: 0.18em;
  }
}
</style>
