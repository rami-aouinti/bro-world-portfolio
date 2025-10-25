<template>
  <transition name="ui-popover-fade">
    <div
      v-if="context.isOpen.value"
      :id="context.id"
      ref="contentRef"
      role="dialog"
      tabindex="-1"
      :class="[
        'absolute top-full z-50 min-w-[12rem] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none',
        alignmentClass,
        attrsClass,
      ]"
      :style="{ marginTop: `${sideOffset}px` }"
      v-bind="forwardedAttrs"
      @keydown="handleKeydown"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
  watchEffect,
} from "vue";
import { uiPopoverContextKey } from "./ui-popover-context";

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }>(),
  {
    align: "center",
    sideOffset: 8,
  },
);

const context = inject(uiPopoverContextKey);

if (!context) {
  throw new Error("UiPopoverContent must be used within a UiPopover component.");
}

const attrs = useAttrs();
const contentRef = ref<HTMLElement | null>(null);

const alignmentClass = computed(() => {
  switch (props.align) {
    case "start":
      return "left-0";
    case "end":
      return "right-0";
    default:
      return "left-1/2 -translate-x-1/2";
  }
});

const sideOffset = computed(() => props.sideOffset);
const attrsClass = computed(() => attrs.class as string | string[] | undefined);
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

watchEffect(() => {
  context.setContent(contentRef.value);
});

watch(
  () => context.isOpen.value,
  (open) => {
    if (open) {
      nextTick(() => {
        contentRef.value?.focus({ preventScroll: true });
      });
    }
  },
);

onBeforeUnmount(() => {
  context.setContent(null);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    context.close();
  }
}
</script>

<style scoped>
.ui-popover-fade-enter-active,
.ui-popover-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.ui-popover-fade-enter-from,
.ui-popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
