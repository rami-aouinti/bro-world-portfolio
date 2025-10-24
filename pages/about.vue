<script setup lang="ts">
import { LOCALIZED_PAGE_META } from '~/utils/i18n/routes'
import Line from "~/components/Layout/Line.vue";
import Skills from "~/components/section/Skills.vue";
import Experience from "~/components/section/Experience.vue";
import Education from "~/components/section/Education.vue";
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