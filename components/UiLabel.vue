<template>
  <label
    :for="props.for"
    :class="resolvedClass"
    v-bind="forwardedAttrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{ for?: string }>();

const attrs = useAttrs();

const baseClass =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const resolvedClass = computed(() => [baseClass, attrs.class].filter(Boolean));

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
</script>
