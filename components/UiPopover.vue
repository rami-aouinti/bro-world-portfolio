<template>
  <div class="relative inline-block text-left">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, provide, ref, watch, useId } from "vue";
import { uiPopoverContextKey } from "./ui-popover-context";

const isOpen = ref(false);
const trigger = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

const id = `ui-popover-${useId()}`;
const isClient = typeof window !== "undefined";

function setTrigger(el: HTMLElement | null) {
  trigger.value = el;
}

function setContent(el: HTMLElement | null) {
  content.value = el;
}

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function toggle(value?: boolean) {
  if (typeof value === "boolean") {
    isOpen.value = value;
    return;
  }

  isOpen.value = !isOpen.value;
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target as Node | null;

  if (!target) {
    return;
  }

  if (trigger.value?.contains(target) || content.value?.contains(target)) {
    return;
  }

  close();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
  }
}

function addListeners() {
  if (!isClient) {
    return;
  }

  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("keydown", handleKeydown);
}

function removeListeners() {
  if (!isClient) {
    return;
  }

  document.removeEventListener("pointerdown", handlePointerDown);
  document.removeEventListener("keydown", handleKeydown);
}

watch(
  isOpen,
  (openState) => {
    if (!isClient) {
      return;
    }

    if (openState) {
      addListeners();
    } else {
      removeListeners();
    }
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  removeListeners();
});

provide(uiPopoverContextKey, {
  id,
  isOpen,
  trigger,
  content,
  open,
  close,
  toggle,
  setTrigger,
  setContent,
});
</script>
