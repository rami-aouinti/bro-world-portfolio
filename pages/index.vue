<template>
  <Personal />
  <Line />
  <About />
  <Line />
  <Skills />
  <Line />
  <Experience />
  <Line />
  <Education />
  <Line />
  <Service />
  <Line />
  <Work />
  <Cta />
</template>
<script setup lang="ts">
import Personal from "~/components/section/Personal.vue";
import Line from "~/components/Layout/Line.vue";
import About from "~/pages/about.vue";
import Skills from "~/pages/skills.vue";
import Experience from "~/pages/experience.vue";
import Education from "~/pages/education.vue";
import Service from "~/pages/service.vue";
import Work from "~/pages/work.vue";
import Cta from "~/components/section/Cta.vue";
</script>