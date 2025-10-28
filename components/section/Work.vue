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
          >
            <CustomGlowCard
              class="work-card"
              :title="card.item.name"
              :eyebrow="card.item.type"
              :to="card.route"
              :variant="card.variant"
              :heading-level="3"
            >
              <template #media>
                <NuxtImg
                  :src="`/images/work/${card.item.thumbnails}`"
                  :alt="t('portfolio.work.thumbnailAlt', { name: card.item.name })"
                  width="1000"
                  height="320"
                  sizes="(min-width: 1280px) 320px, (min-width: 960px) 33vw, (min-width: 600px) 50vw, 90vw"
                  densities="1x, 2x"
                  class="work-card__image"
                  loading="lazy"
                />
              </template>

              <template #default>
                <p class="work-card__summary">
                  {{ card.item.description }}
                </p>
              </template>

              <template #footer>
                <div class="work-card__footer">
                  <span class="work-card__footer-label">
                    {{ t("portfolio.work.footerLabel") }}
                  </span>
                  <v-btn
                    v-if="card.item.live_demo"
                    :href="card.item.live_demo"
                    target="_blank"
                    rel="noopener"
                    color="primary"
                    variant="text"
                    class="text-none"
                    @click.stop
                    @keydown.stop
                  >
                    {{ t("portfolio.work.liveDemo") }}
                  </v-btn>
                </div>
              </template>
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
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";
import { BlurReveal } from "~/components/ui/blur-reveal";
import { glowCardVariantCycle } from "~/utils/glowCardVariants";

const { data: work } = useContentBlock("work");
const { t } = useI18n();
const localePath = useLocalePath();
const content = computed(() => work.value);
const workCards = computed(() => {
  const items = content.value?.works ?? [];

  return items.map((item, index) => ({
    item,
    route: resolveLocalizedRouteTarget(`/work/${item.slug}`, localePath),
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
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
.work-card {
  height: 100%;
}

.work-card__image {
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 3;
  object-fit: cover;
}

.work-card__summary {
  margin: 0;
  font-size: clamp(0.95rem, 2.2vw, 1.05rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 82%, rgba(15, 23, 42, 0.6) 18%);
}

.work-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--card-accent, #2563eb) 20%, transparent);
}

.work-card__footer-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 65%, rgba(15, 23, 42, 0.55) 35%);
}

@media (max-width: 600px) {
  .work-section :deep(.v-container) {
    padding-inline: 1.25rem;
  }

  .work-card__image {
    aspect-ratio: 16 / 9;
  }

  .work-card__footer-label {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
  }
}
</style>
