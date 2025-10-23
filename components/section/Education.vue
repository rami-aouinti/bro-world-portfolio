<script setup lang="ts">
const { data: education } = useContentBlock('education')

const educationContent = computed(() => education.value)
</script>

<template>
  <LayoutScrollSmooth>
    <section class="container" v-if="educationContent">
      <p class="badge">{{ educationContent.label }}</p>
      <h2 class="section-title">{{ educationContent.headline }}</h2>

      <div class="grid gap-6 mt-12 md:grid-cols-2">
        <div
          class="card h-full"
          v-for="school in educationContent.schools"
          :key="school.degree + school.institution"
        >
          <p class="text-sm font-semibold uppercase text-white/50">{{ school.timeframe }}</p>
          <h3 class="mt-3 text-2xl font-semibold text-white">{{ school.degree }}</h3>
          <p class="text-white/60">{{ school.institution }}</p>
          <p class="paragraph mt-4">{{ school.details }}</p>
        </div>
      </div>
    </section>
  </LayoutScrollSmooth>
</template>
