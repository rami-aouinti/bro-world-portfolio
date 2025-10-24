<template>
  <button
    type="button"
    :class="toggleButtonClass"
    aria-label="Toggle color mode"
    :disabled="!isToggleAllowed"
    :aria-disabled="!isToggleAllowed"
    @click="toggleColorMode"
  >
    <Icon
      name="lucide:sun"
      class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      size="18"
    />
    <Icon
      name="lucide:moon"
      class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      size="18"
    />
    <span class="sr-only">Toggle theme</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCookieColorMode } from "#imports";
import { useSiteSettingsState } from "~/composables/useSiteSettingsState";
import { uiButtonClass } from "~/utils/ui/button";

const props = defineProps<{ buttonClass?: string }>();

const colorMode = useCookieColorMode();
const siteSettings = useSiteSettingsState();
const isToggleAllowed = computed(() => siteSettings.value?.ui.allowThemeSwitching !== false);
const toggleButtonClass = computed(() =>
  uiButtonClass({
    variant: "ghost",
    size: "icon",
    className: props.buttonClass,
  }),
);
const resolvedMode = computed<"light" | "dark">(() => {
  if (colorMode.value === "dark" || colorMode.value === "light") {
    return colorMode.value;
  }

  return colorMode.system.value === "dark" ? "dark" : "light";
});

function toggleColorMode() {
  if (!isToggleAllowed.value) {
    return;
  }

  colorMode.value = resolvedMode.value === "dark" ? "light" : "dark";
}
</script>
