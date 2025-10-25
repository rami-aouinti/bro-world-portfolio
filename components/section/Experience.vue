<template>
  <section id="experience">
    <ScrollSmooth>
      <v-container
        v-if="experiencesContent"
        class="mt-10"
      >
        <h2 class="text-h4 text-foreground">{{ experiencesContent.headline }}</h2>

        <v-timeline
          class="mt-10"
          density="compact"
        >
          <v-timeline-item
            v-for="card in experienceCards"
            :key="card.position.slug"
            :dot-color="card.accent"
          >
            <CustomGlowCard
              :title="card.position.role"
              :description="card.position.summary ?? card.fallbackSummary"
              :eyebrow="card.position.company"
              :badge="card.position.timeframe"
              :to="card.route"
              :variant="card.variant"
            >
              <ul class="experience__list">
                <li
                  v-for="achievement in card.position.achievements"
                  :key="achievement"
                  class="experience__list-item"
                >
                  <v-icon
                    icon="mdi-check-circle-outline"
                    size="18"
                    class="experience__icon"
                  />
                  <span>{{ achievement }}</span>
                </li>
              </ul>
            </CustomGlowCard>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import CustomGlowCard from "~/components/CustomGlowCard.vue";
import { glowCardVariantCycle, glowCardVariants } from "~/utils/glowCardVariants";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from "~/utils/i18n/resolve-target";

const { data: experiences } = useContentBlock("experiences");
const { t } = useI18n();
const localePath = useLocalePath();

const experiencesContent = computed(() => experiences.value);
const experienceCards = computed(() => {
  const positions = experiencesContent.value?.positions ?? [];

  return positions.map((position, index) => {
    const variant = glowCardVariantCycle[index % glowCardVariantCycle.length];

    return {
      position,
      route: resolveLocalizedRouteTarget(`/experience/${position.slug}`, localePath),
      variant,
      accent: glowCardVariants[variant].accent,
      fallbackSummary: t("portfolio.experience.fallbackSummary", { company: position.company }),
    };
  });
});
</script>

<style scoped>
.experience__list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.experience__list-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(226, 232, 240, 0.9);
}

.experience__icon {
  color: currentColor;
  margin-top: 2px;
}
</style>
