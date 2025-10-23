<template>
  <LayoutScrollSmooth>
    <section class="container">
      <p class="badge">{{ EDUCATION.label }}</p>
      <h2 class="section-title">{{ EDUCATION.headline }}</h2>

      <div class="grid gap-6 mt-12 md:grid-cols-2">
        <div class="card h-full" v-for="school in EDUCATION.schools" :key="school.degree + school.institution">
          <p class="text-sm font-semibold uppercase text-white/50">{{ school.timeframe }}</p>
          <h3 class="mt-3 text-2xl font-semibold text-white">{{ school.degree }}</h3>
          <p class="text-white/60">{{ school.institution }}</p>
          <p class="paragraph mt-4">{{ school.details }}</p>
        </div>
      </div>
    </section>
  </LayoutScrollSmooth>
</template>
