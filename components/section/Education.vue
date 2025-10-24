<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'

const { data: education } = useContentBlock('education')

const educationContent = computed(() => education.value)
const educationCards = computed(() => {
  const schools = educationContent.value?.schools ?? []

  return schools.map((school, index) => ({
    school,
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length]
  }))
})
</script>

<template>
  <section id="education">
    <LayoutScrollSmooth>
      <v-container v-if="educationContent" class="py-16">
        <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
          {{ educationContent.label }}
        </v-chip>
        <h2 class="text-h4 font-weight-semibold">{{ educationContent.headline }}</h2>

        <v-row class="mt-10" dense>
          <v-col v-for="card in educationCards" :key="card.school.degree + card.school.institution" cols="12" md="6">
            <CustomGlowCard
              class="education__card"
              :title="card.school.degree"
              :description="card.school.details"
              :eyebrow="card.school.institution"
              :badge="card.school.timeframe"
              :variant="card.variant"
            />
          </v-col>
        </v-row>
      </v-container>
    </LayoutScrollSmooth>
  </section>
</template>

<style scoped>
.education__card {
  height: 100%;
}
</style>
