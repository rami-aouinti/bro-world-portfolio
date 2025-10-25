<template>
  <Personal />
  <Line :section-name="aboutLabel" />
  <About />
  <Line :section-name="skillsLabel" />
  <Skills />
  <Line :section-name="experienceLabel" />
  <Experience />
  <Line :section-name="educationLabel" />
  <Education />
  <Line :section-name="serviceLabel" />
  <Service />
  <Line :section-name="workLabel" />
  <Work />
  <Cta />
</template>

<script setup lang="ts">
import { computed } from "vue";

import LampHero from "~/components/section/LampHero.vue";
import Personal from "~/components/section/Personal.vue";
import Line from "~/components/Layout/Line.vue";
import About from "~/components/section/About.vue";
import Skills from "~/components/section/Skills.vue";
import Experience from "~/components/section/Experience.vue";
import Education from "~/components/section/Education.vue";
import Service from "~/components/section/Service.vue";
import Work from "~/components/section/Work.vue";
import LampCallout from "~/components/section/LampCallout.vue";
import Cta from "~/components/section/Cta.vue";

const { data: aboutContent } = useContentBlock("about");
const { data: skillsContent } = useContentBlock("skills");
const { data: experienceContent } = useContentBlock("experiences");
const { data: educationContent } = useContentBlock("education");
const { data: serviceContent } = useContentBlock("service");
const { data: workContent } = useContentBlock("work");

const aboutLabel = computed(() => aboutContent.value?.label ?? "");
const skillsLabel = computed(() => skillsContent.value?.label ?? "");
const experienceLabel = computed(() => experienceContent.value?.label ?? "");
const educationLabel = computed(() => educationContent.value?.label ?? "");
const serviceLabel = computed(() => serviceContent.value?.label ?? "");
const workLabel = computed(() => workContent.value?.label ?? "");
</script>
