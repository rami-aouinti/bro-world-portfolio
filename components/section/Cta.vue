<script setup lang="ts">
const { data: cta } = useContentBlock('cta')
const { data: navlinks } = useContentBlock('navlinks')
const { data: profile } = useContentBlock('profile')

const ctaContent = computed(() => cta.value)
const links = computed(() => navlinks.value ?? [])
const profileName = computed(() => {
  if (!profile.value) {
    return ''
  }
  return `${profile.value.firstname} ${profile.value.lastname}`
})
</script>

<template>
  <LayoutScrollSmooth>
    <section id="contact" class="max-w-5xl mx-auto px-4 lg:px-0">
    <div class="mesh-gradient flex items-center flex-col rounded-3xl border bg-[#0b061a] border-white/10 p-10 relative" v-if="ctaContent">
        <div class="flex flex-col items-center">
          <h2 class="text-center !max-w-xl section-title ">{{ ctaContent.label }}</h2>
        <p class="paragraph max-w-xl text-center mt-8">
          {{ ctaContent.description }}
        </p>
        <Button class="mt-10" to="/contact" variant="btn-primary" label="Start Collaboration"/>

        <div class="my-8 w-4/5 h-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 "></div>

        <div class="flex items-center gap-4 lg:gap-10">
          <NuxtLink
          class="text-white/60 group text-sm lg:text-base"
          v-for="link in links"
          :key="link.url"
          :to="link.url"
        >
          <div class="relative overflow-hidden">
            <p
              class="group-hover:-translate-y-7 duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            >
              {{ link.label }}
            </p>
            <p
              class="absolute top-7 left-0 group-hover:top-0 duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            >
              {{ link.label }}
            </p>
          </div>
        </NuxtLink>
        </div>
        </div>

        <p class="text-sm text-white/30 text-center mt-8">&copy; {{ new Date().getFullYear() }} {{ profileName }}</p>

        <div
          class="absolute  bottom-0 w-60 h-[1px] z-10 bg-gradient-to-r from-[#0b50e5]/0 via-[#0b50e5] to-[#0b50e5]/0"
        ></div>
        <div class="-z-10 absolute bottom-4 w-96 bg-[#0b50e5] rounded-full blur-2xl h-40 animate-pulse"></div>
    </div>
  </section>
  </LayoutScrollSmooth>
</template>
