<script setup lang="ts">
import { computed } from 'vue'

import CustomGlowCard from '~/components/CustomGlowCard.vue'
import { glowCardVariantCycle } from '~/utils/glowCardVariants'
import ScrollSmooth from "~/components/Layout/ScrollSmooth.vue";
import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const { data: education } = useContentBlock('education')
const localePath = useLocalePath()

const educationContent = computed(() => education.value)
const educationCards = computed(() => {
  const schools = educationContent.value?.schools ?? []

  return schools.map((school, index) => ({
    school,
    route: resolveLocalizedRouteTarget(`/education/${school.slug}`, localePath),
    variant: glowCardVariantCycle[index % glowCardVariantCycle.length]
  }))
})
</script>

<template>
  <section id="education">
    <ScrollSmooth>
      <v-container v-if="educationContent" class="py-6">
        <v-chip color="primary" variant="outlined" class="text-uppercase mb-4">
          {{ educationContent.label }}
        </v-chip>
        <h2 class="text-h4 text-foreground">{{ educationContent.headline }}</h2>

        <v-row class="mt-10" dense>
          <v-col v-for="card in educationCards" :key="card.school.slug" cols="12" md="6">
            <CustomGlowCard
              class="education__card"
              :title="card.school.degree"
              :description="card.school.details"
              :eyebrow="card.school.institution"
              :badge="card.school.timeframe"
              :to="card.route"
              :variant="card.variant"
            />
          </v-col>
        </v-row>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<style scoped>
.education__card {
  height: 100%;
}
</style>
