<template>
  <LayoutScrollSmooth>
    <section class="container">
      <p class="badge">{{ SKILLS.label }}</p>
      <h2 class="section-title">{{ SKILLS.headline }}</h2>
      <p class="paragraph mt-4 max-w-2xl">{{ SKILLS.subline }}</p>

      <div class="grid gap-6 mt-12 md:grid-cols-3">
        <div class="card h-full" v-for="category in SKILLS.categories" :key="category.name">
          <h3 class="text-xl font-semibold text-white">{{ category.name }}</h3>
          <ul class="flex flex-wrap gap-3 mt-6">
            <li v-for="skill in category.skills" :key="skill">
              <span class="inline-flex px-3 py-1 text-sm text-white/70 border border-white/10 rounded-full bg-white/5">
                {{ skill }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </LayoutScrollSmooth>
</template>
