<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import Line from "~/components/Layout/Line.vue";
import Skills from "~/pages/skills.vue";
import Experience from "~/pages/experience.vue";
import Education from "~/pages/education.vue";
import Cta from "~/components/section/Cta.vue";
import About from "~/components/section/About.vue";
definePageMeta(LOCALIZED_PAGE_META.about)
</script>

<template>
  <About />
  <Line />
  <Skills />
  <Line />
  <Experience />
  <Line />
  <Education />
  <Cta />
</template>