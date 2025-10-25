<template>
  <About />
  <Line :section-name="skillsLabel" />
  <Skills />
  <Line :section-name="experienceLabel" />
  <Experience />
  <Line :section-name="educationLabel" />
  <Education />
  <Cta />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { LOCALIZED_PAGE_META } from "~/utils/i18n/routes";
import Line from "~/components/layout/Line.vue";
import Skills from "~/components/section/Skills.vue";
import Experience from "~/components/section/Experience.vue";
import Education from "~/components/section/Education.vue";
import Cta from "~/components/section/Cta.vue";
import About from "~/components/section/About.vue";

definePageMeta(LOCALIZED_PAGE_META.about);

const { data: skillsContent } = useContentBlock("skills");
const { data: experienceContent } = useContentBlock("experiences");
const { data: educationContent } = useContentBlock("education");

const skillsLabel = computed(() => skillsContent.value?.label ?? "");
const experienceLabel = computed(() => experienceContent.value?.label ?? "");
const educationLabel = computed(() => educationContent.value?.label ?? "");
</script>
