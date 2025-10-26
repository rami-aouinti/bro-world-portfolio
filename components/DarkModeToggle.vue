<template>
  <UiButton
    variant="ghost"
    size="icon"
    type="button"
    :class="buttonClass"
    aria-label="Toggle color mode"
    :disabled="!isToggleAllowed"
    :aria-disabled="!isToggleAllowed"
    @click="toggleColorMode"
  >
    <Icon
      name="lucide:sun"
      class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      :size="resolvedIconSize"
    />
    <Icon
      name="lucide:moon"
      class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      :size="resolvedIconSize"
    />
    <span class="sr-only">Toggle theme</span>
  </UiButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCookieColorMode } from "#imports";
import { useSiteSettingsState } from "~/composables/useSiteSettingsState";
import UiButton from "~/components/UiButton.vue";

const props = withDefaults(defineProps<{ buttonClass?: string; iconSize?: number }>(), {
  iconSize: 18,
});

const buttonClass = computed(() => props.buttonClass ?? "");
const resolvedIconSize = computed(() => props.iconSize ?? 18);

const colorMode = useCookieColorMode();
const siteSettings = useSiteSettingsState();
const isToggleAllowed = computed(() => siteSettings.value?.ui.allowThemeSwitching !== false);
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
