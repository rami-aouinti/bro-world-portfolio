<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle, glowCardVariants } from '~/utils/glowCardVariants'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: education } = useContentBlock('education')
const localePath = useLocalePath()

const educationContent = computed(() => education.value)
const educationCards = computed(() => {
  const schools = educationContent.value?.schools ?? []

  return schools.map((school, index) => {
    const variant = glowCardVariantCycle[index % glowCardVariantCycle.length]

    return {
      school,
      route: resolveLocalizedRouteTarget(`/education/${school.slug}`, localePath),
      variant,
      accentColor: glowCardVariants[variant].accent
    }
  })
})
</script>

<template>
  <section id="education">
    <ScrollSmooth>
      <v-container v-if="educationContent" class="mt-10">
        <h2 class="text-h4 text-foreground">{{ educationContent.headline }}</h2>
        <v-timeline
          class="education__timeline mt-10"
          density="comfortable"
          line-inset="16"
          side="end"
        >
          <v-timeline-item
            v-for="card in educationCards"
            :key="card.school.slug"
            :dot-color="card.accentColor"
            fill-dot
          >
            <template #opposite>
              <span class="education__timeline-time">{{ card.school.timeframe }}</span>
            </template>

            <CustomGlowCard
              class="education__card"
              :title="card.school.degree"
              :description="card.school.details"
              :eyebrow="card.school.institution"
              :badge="card.school.timeframe"
              :to="card.route"
              :variant="card.variant"
            />
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.education__card {
  height: 100%;
}

.education__timeline {
  --v-theme-surface: transparent;
}

.education__timeline-time {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.14);
  color: rgba(226, 232, 240, 0.85);
  font-size: 0.9rem;
  backdrop-filter: blur(6px);
}

@media (max-width: 959px) {
  .education__timeline {
    padding-inline-start: 0;
  }

  .education__timeline-time {
    margin-bottom: 12px;
  }
}
</style>
