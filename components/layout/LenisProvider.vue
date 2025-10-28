<template>
  <div
    ref="rootRef"
    class="lenis-provider"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useSmoothScroll } from "~/composables/useSmoothScroll";

const rootRef = ref<HTMLElement | null>(null);
const { registerRoot, isSupported, isEnabled } = useSmoothScroll();

const smoothScrollState = computed(() =>
  isSupported.value && isEnabled.value ? "enabled" : "disabled",
);

onMounted(() => {
  registerRoot(rootRef.value);
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
</style>
