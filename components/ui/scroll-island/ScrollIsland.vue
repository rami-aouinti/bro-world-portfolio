<template>
  <MotionConfig
    :transition="{
      duration: 0.7,
      type: 'spring',
      bounce: 0.5,
    }"
  >
    <div
      :class="
        cn(
          'fixed left-1/2 top-12 z-[999] -translate-x-1/2 bg-primary/90 backdrop-blur-lg border-radius',
          $props.class,
        )
      "
      @click="() => (open = !open)"
    >
      <motion.div
        id="motion-id"
        layout
        :initial="{
          height: props.height,
          width: 0,
        }"
        :animate="{
          height: open && isSlotAvailable ? 'auto' : props.height,
          width: open && isSlotAvailable ? 320 : 260,
        }"
        class="bg-natural-900 relative cursor-pointer overflow-hidden text-secondary"
      >
        <header class="gray- flex h-11 cursor-pointer items-center gap-2 px-4">
          <AnimatedCircularProgressBar
            :value="scrollPercentage * 100"
            :min="0"
            :max="100"
            :circle-stroke-width="10"
            class="w-6"
            :show-percentage="false"
            :duration="0.3"
            :gauge-secondary-color="isDark ? '#6b728055' : '#6b728099'"
            :gauge-primary-color="isDark ? 'black' : 'white'"
          />
          <h1 class="grow text-center font-bold">{{ title }}</h1>
          <NumberFlow
            :value="scrollPercentage"
            :format="{ style: 'percent' }"
            locales="en-US"
          />
        </header>
        <motion.div
          v-if="isSlotAvailable"
          class="scroll-island__content mb-2 flex h-full max-h-60 flex-col gap-1 overflow-y-auto px-4 text-sm"
        >
          <slot />
        </motion.div>
      </motion.div>
    </div>
  </MotionConfig>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/vue";
import { useColorMode } from "@vueuse/core";
import { motion, MotionConfig } from "motion-v";
import { computed, onMounted, onUnmounted, ref, toRef, useSlots } from "vue";
import {AnimatedCircularProgressBar} from "~/components/ui/animated-circular-progressbar";

interface Props {
  class?: string;
  title?: string;
  height?: number;
  scrollbarThumbColor?: string;
  scrollbarTrackColor?: string;
  scrollbarThumbBorderColor?: string;
  darkScrollbarThumbColor?: string;
  darkScrollbarTrackColor?: string;
  darkScrollbarThumbBorderColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  title: "Progress",
  height: 44,
  scrollbarThumbColor: "rgba(244, 63, 94, 0.75)",
  scrollbarTrackColor: "rgba(244, 63, 94, 0.18)",
  scrollbarThumbBorderColor: "rgba(15, 23, 42, 0.35)",
  darkScrollbarThumbColor: "rgba(236, 72, 153, 0.75)",
  darkScrollbarTrackColor: "rgba(15, 23, 42, 0.6)",
  darkScrollbarThumbBorderColor: "rgba(236, 72, 153, 0.4)",
});

const open = ref(false);
const slots = useSlots();

const scrollPercentage = ref(0);

const isDark = computed(() => useColorMode().value == "dark");
const isSlotAvailable = computed(() => !!slots.default);
const borderRadius = computed(() => `${props.height / 2}px`);
const scrollbarThumbColor = toRef(props, "scrollbarThumbColor");
const scrollbarTrackColor = toRef(props, "scrollbarTrackColor");
const scrollbarThumbBorderColor = toRef(props, "scrollbarThumbBorderColor");
const darkScrollbarThumbColor = toRef(props, "darkScrollbarThumbColor");
const darkScrollbarTrackColor = toRef(props, "darkScrollbarTrackColor");
const darkScrollbarThumbBorderColor = toRef(props, "darkScrollbarThumbBorderColor");

onMounted(() => {
  if (window === undefined) return;

  window.addEventListener("scroll", updatePageScroll);
  updatePageScroll();
});

function updatePageScroll() {
  scrollPercentage.value = window.scrollY / (document.body.scrollHeight - window.innerHeight);
}

onUnmounted(() => {
  window.removeEventListener("scroll", updatePageScroll);
});
</script>

<style scoped>
.border-radius {
  border-radius: v-bind(borderRadius);
}

.scroll-island__content {
  --scroll-island-thumb-color: v-bind(scrollbarThumbColor);
  --scroll-island-track-color: v-bind(scrollbarTrackColor);
  --ui-scrollbar-size: 0.625rem;
  --ui-scrollbar-thumb-color: var(--scroll-island-thumb-color);
  --ui-scrollbar-thumb-border-color: v-bind(scrollbarThumbBorderColor);
  --ui-scrollbar-thumb-border-width: 2px;
  --ui-scrollbar-thumb-radius: 9999px;
  --ui-scrollbar-track-color: var(--scroll-island-track-color);
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-island-thumb-color) var(--scroll-island-track-color);
}

@media (prefers-color-scheme: dark) {
  .scroll-island__content {
    --scroll-island-thumb-color: v-bind(darkScrollbarThumbColor);
    --scroll-island-track-color: v-bind(darkScrollbarTrackColor);
    --ui-scrollbar-thumb-border-color: v-bind(darkScrollbarThumbBorderColor);
    scrollbar-color: var(--scroll-island-thumb-color) var(--scroll-island-track-color);
  }
}
</style>
