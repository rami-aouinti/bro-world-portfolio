<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'

const { data: skills } = useContentBlock('skills')

const skillsContent = computed(() => skills.value)
const skillCards = computed(() => {
  const categories = skillsContent.value?.categories ?? []

  return categories.map((category, index) => ({
    category,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length],
    badge: `${category.skills.length} skills`
  }))
})
</script>

<template>
  <section id="skills">
    <LayoutScrollSmooth>
      <v-container v-if="skillsContent" class="py-16">
        <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
          {{ skillsContent.label }}
        </v-chip>
        <h2 class="text-h4 font-weight-semibold">{{ skillsContent.headline }}</h2>
        <p class="text-body-1 text-medium-emphasis mt-4" style="max-width: 600px;">
          {{ skillsContent.subline }}
        </p>

        <v-row class="mt-10" dense>
          <v-col v-for="card in skillCards" :key="card.category.name" cols="12" md="4">
            <CustomGlowCard
              class="skills__card"
              :title="card.category.name"
              :variant="card.variant"
              :badge="card.badge"
              description="Highlighted tools and technologies."
            >
              <div class="skills__chips">
                <v-chip
                  v-for="skill in card.category.skills"
                  :key="skill"
                  class="skills__chip"
                  color="primary"
                  variant="tonal"
                  size="small"
                >
                  {{ skill }}
                </v-chip>
              </div>
            </CustomGlowCard>
          </v-col>
        </v-row>
      </v-container>
    </LayoutScrollSmooth>
  </section>
</template>

<style scoped>
.skills__card {
  height: 100%;
}

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skills__chip {
  text-transform: none;
}
</style>
