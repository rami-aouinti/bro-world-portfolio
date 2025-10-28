<template>
  <div
    ref="rootRef"
    class="lenis-provider"
    :data-smooth-scroll="smoothScrollState"
  >
    <div
      ref="contentRef"
      class="lenis-content"
      data-lenis-content
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useSmoothScroll } from "~/composables/useSmoothScroll";

const rootRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const { registerRoot, isSupported, isEnabled } = useSmoothScroll();

const smoothScrollState = computed(() =>
  isSupported.value && isEnabled.value ? "enabled" : "disabled",
);

onMounted(() => {
  nextTick(() => {
    if (!rootRef.value || !contentRef.value) {
      return;
    }
    registerRoot(rootRef.value);
  });
});

onBeforeUnmount(() => {
  registerRoot(null);
});
</script>

<style scoped>
.lenis-provider {
  position: relative;
  min-height: 100%;
  width: 100%;
  isolation: isolate;
}

.lenis-content {
  min-height: 100%;
  width: 100%;
}
</style>
