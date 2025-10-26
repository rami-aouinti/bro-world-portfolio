<template>
  <div
    ref="el"
    :class="{ 'animate-fade': isVisible }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    initiallyVisible?: boolean;
  }>(),
  {
    initiallyVisible: false,
  },
);

const el = ref<HTMLElement | null>(null);
const isVisible = ref(props.initiallyVisible);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!el.value) {
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting;
    },
    {
      threshold: 0.1,
    },
  );

  observer.observe(el.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<style scoped>
.animate-fade {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.9s ease;
}
div {
  opacity: 0;
  transform: translateY(20px);
}
</style>
