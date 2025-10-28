<template>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0)"
    :viewport="viewportConfig"
  >
    <Personal />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.1)"
    :viewport="viewportConfig"
  >
    <Line :section-name="aboutLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.15)"
    :viewport="viewportConfig"
  >
    <About />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.2)"
    :viewport="viewportConfig"
  >
    <Line :section-name="skillsLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.25)"
    :viewport="viewportConfig"
  >
    <Skills />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.3)"
    :viewport="viewportConfig"
  >
    <Line :section-name="experienceLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.35)"
    :viewport="viewportConfig"
  >
    <Experience />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.4)"
    :viewport="viewportConfig"
  >
    <Line :section-name="educationLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.45)"
    :viewport="viewportConfig"
  >
    <Education />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.5)"
    :viewport="viewportConfig"
  >
    <Line :section-name="serviceLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.55)"
    :viewport="viewportConfig"
  >
    <Service />
  </Motion>
  <Motion
    :initial="lineInitial"
    :while-in-view="lineVisible"
    :transition="lineTransition(0.6)"
    :viewport="viewportConfig"
  >
    <Line :section-name="workLabel" />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.65)"
    :viewport="viewportConfig"
  >
    <Work />
  </Motion>
  <Motion
    :initial="sectionInitial"
    :while-in-view="sectionVisible"
    :transition="sectionTransition(0.7)"
    :viewport="viewportConfig"
  >
    <PortfolioShowcase />
  </Motion>
  <Motion
    :initial="ctaInitial"
    :while-in-view="ctaVisible"
    :transition="sectionTransition(0.8)"
    :viewport="viewportConfig"
  >
    <Cta />
  </Motion>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { Motion } from "motion-v";

import Line from "~/components/layout/Line.vue";
import Personal from "~/components/section/Personal.vue";

const About = defineAsyncComponent(() => import("~/components/section/About.vue"));
const Skills = defineAsyncComponent(() => import("~/components/section/Skills.vue"));
const Experience = defineAsyncComponent(() => import("~/components/section/Experience.vue"));
const Education = defineAsyncComponent(() => import("~/components/section/Education.vue"));
const Service = defineAsyncComponent(() => import("~/components/section/Service.vue"));
const Work = defineAsyncComponent(() => import("~/components/section/Work.vue"));
const PortfolioShowcase = defineAsyncComponent(
  () => import("~/components/section/PortfolioShowcase.vue"),
);
const Cta = defineAsyncComponent(() => import("~/components/section/Cta.vue"));

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

const sectionInitial = { opacity: 0, y: 56, filter: "blur(12px)" };
const sectionVisible = { opacity: 1, y: 0, filter: "blur(0px)" };
const ctaInitial = { opacity: 0, scale: 0.94 };
const ctaVisible = { opacity: 1, scale: 1 };
const lineInitial = { opacity: 0, scaleX: 0.86 };
const lineVisible = { opacity: 1, scaleX: 1 };
const viewportConfig = { once: true, amount: 0.35 };

function sectionTransition(delay = 0) {
  return {
    duration: 0.7,
    delay,
    ease: "easeOut",
  };
}

function lineTransition(delay = 0) {
  return {
    duration: 0.5,
    delay,
    ease: "easeOut",
  };
}
</script>
