<template>
  <LayoutScrollSmooth>
    <section class="container">
      <p class="badge">{{ EXPERIENCES.label }}</p>
      <h2 class="section-title">{{ EXPERIENCES.headline }}</h2>

      <div class="flex flex-col gap-6 mt-12">
        <div class="card" v-for="position in EXPERIENCES.positions" :key="position.role + position.company">
          <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 class="text-2xl font-semibold text-white">{{ position.role }}</h3>
              <p class="text-white/60">{{ position.company }}</p>
            </div>
            <p class="text-sm font-medium text-white/50 md:text-right">{{ position.timeframe }}</p>
          </div>
          <ul class="mt-6 space-y-3 list-disc list-inside text-white/70">
            <li v-for="achievement in position.achievements" :key="achievement">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </LayoutScrollSmooth>
</template>
