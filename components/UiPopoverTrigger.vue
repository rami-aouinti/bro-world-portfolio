<template>
  <component
    :is="tag"
    ref="triggerRef"
    :type="tag === 'button' ? 'button' : undefined"
    :class="[tag === 'span' ? 'contents' : 'inline-flex items-center', attrsClass]"
    :aria-controls="context.id"
    :aria-expanded="context.isOpen.value"
    aria-haspopup="dialog"
    v-bind="forwardedAttrs"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watchEffect } from "vue";
import { uiPopoverContextKey } from "./ui-popover-context";

const props = withDefaults(
  defineProps<{
    asChild?: boolean;
  }>(),
  {
    asChild: false,
  },
);

const context = inject(uiPopoverContextKey);

if (!context) {
  throw new Error("UiPopoverTrigger must be used within a UiPopover component.");
}

const attrs = useAttrs();
const triggerRef = ref<HTMLElement | null>(null);

const tag = computed(() => (props.asChild ? "span" : "button"));
const attrsClass = computed(() => attrs.class as string | string[] | undefined);
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

watchEffect(() => {
  context.setTrigger(triggerRef.value);
});

onBeforeUnmount(() => {
  context.setTrigger(null);
});

function handleClick() {
  context.toggle();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    context.toggle();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    context.close();
  }
}
</script>
