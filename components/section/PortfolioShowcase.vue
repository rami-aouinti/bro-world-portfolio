<template>
  <section
    id="portfolio-showcase"
    class="portfolio-showcase"
  >
    <ScrollSmooth>
      <v-container
        v-if="cards.length"
        class="portfolio-showcase__container"
      >
        <BlurReveal
          :delay="0.35"
          :duration="0.7"
          class="portfolio-showcase__header"
        >
          <h2 class="portfolio-showcase__title text-h4 text-foreground">
            {{ heading }}
          </h2>
          <p
            v-if="subline"
            class="portfolio-showcase__description text-body-1 text-foreground"
          >
            {{ subline }}
          </p>
        </BlurReveal>

        <v-slide-group
          :show-arrows="!isCompactViewport"
          class="portfolio-showcase__carousel"
          :mobile="isCompactViewport"
          center-active
        >
          <v-slide-group-item
            v-for="card in cards"
            :key="card.item.slug"
          >
            <CustomGlowCard
              class="portfolio-showcase__card"
              :title="card.item.name"
              :badge="card.item.type"
              :variant="card.variant"
              :heading-level="2"
              padding="clamp(18px, 3vw, 24px)"
              border-radius="22px"
              outline-color="rgba(148, 163, 184, 0.18)"
            >
              <template #media>
                <NuxtImg
                  :src="`/images/work/${card.item.thumbnails}`"
                  :alt="card.item.name"
                  width="560"
                  height="360"
                  sizes="(min-width: 1280px) 280px, (min-width: 960px) 240px, (min-width: 640px) 50vw, 88vw"
                  densities="1x, 2x"
                  class="portfolio-showcase__image"
                  loading="lazy"
                />
              </template>

              <template #footer>
                <div class="portfolio-showcase__footer">
                  <span class="portfolio-showcase__footer-label">
                    {{ t("portfolio.personal.viewProjectLabel") }}
                  </span>
                  <div class="portfolio-showcase__footer-actions">
                    <v-btn
                      :to="card.route"
                      color="primary"
                      variant="text"
                      class="text-none"
                    >
                      {{ t("portfolio.work.backToProjects") }}
                    </v-btn>
                    <v-btn
                      v-if="card.item.live_demo"
                      :to="card.item.live_demo"
                      target="_blank"
                      color="primary"
                      variant="outlined"
                      class="text-none"
                    >
                      {{ t("portfolio.personal.viewProjectCta") }}
                    </v-btn>
                  </div>
                </div>
              </template>
            </CustomGlowCard>
          </v-slide-group-item>
        </v-slide-group>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery, useMounted } from "@vueuse/core";

import CustomGlowCard from "~/components/CustomGlowCard.vue";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { BlurReveal } from "~/components/ui/blur-reveal";
import { glowCardVariantCycle } from "~/utils/glowCardVariants";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

const { data: work } = useContentBlock("work");
const { t } = useI18n();
const localePath = useLocalePath();

const content = computed(() => work.value);
const heading = computed(() => content.value?.headline ?? t("portfolio.personal.viewProjects"));
const subline = computed(() => content.value?.subline ?? "");

const cards = computed(() => {
  const items = content.value?.works ?? [];

  return items.map((item, index) => ({
    item,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
    route: resolveLocalizedRouteTarget(`/work/${item.slug}`, localePath),
  }));
});

const isMounted = useMounted();
const compactViewportQuery = useMediaQuery("(max-width: 640px)", {
  initialValue: false,
});
const isCompactViewport = computed(() => isMounted.value && compactViewportQuery.value);
</script>

<style scoped>
@reference "../../assets/styles/index.css";

.portfolio-showcase {
  padding-block: clamp(48px, 12vw, 96px);
}

.portfolio-showcase__container {
  padding-inline: clamp(18px, 6vw, 64px);
}

.portfolio-showcase__header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(32px, 6vw, 56px);
}

.portfolio-showcase__title {
  font-weight: 700;
}

.portfolio-showcase__description {
  margin-top: 16px;
  color: rgba(226, 232, 240, 0.85);
}

.portfolio-showcase__carousel {
  --carousel-inline-padding: clamp(12px, 5vw, 28px);
}

.portfolio-showcase__carousel :deep(.v-slide-group__content) {
  display: flex;
  align-items: stretch;
  gap: clamp(14px, 4vw, 24px);
  padding-inline: var(--carousel-inline-padding);
  scroll-snap-type: x proximity;
}

.portfolio-showcase__carousel :deep(.v-slide-group__slide) {
  scroll-snap-align: start;
}

.portfolio-showcase__card {
  width: clamp(220px, 44vw, 280px);
  margin: 10px;
}

.portfolio-showcase__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 16px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.portfolio-showcase__footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  margin-top: 12px;
}

.portfolio-showcase__footer-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--card-text-color) 58%, white 42%);
}

.portfolio-showcase__footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 640px) {
  .portfolio-showcase__carousel :deep(.v-slide-group__content) {
    padding-inline: calc(var(--carousel-inline-padding) - 4px);
  }

  .portfolio-showcase__card {
    width: min(260px, 82vw);
  }
}
</style>
