<template>
  <ClientOnly>
    <template #fallback>
      <button
        type="button"
        :class="disabledTriggerClass"
        aria-label="Toggle theme customization"
        aria-disabled="true"
        disabled
      >
        <Icon
          name="lucide:paintbrush"
          size="16"
        />
      </button>
    </template>
    <VMenu
      v-model="isMenuOpen"
      :close-on-content-click="false"
      :location="menuLocation"
      :offset="12"
      transition="scale-transition"
    >
      <template #activator="{ props: activatorProps }">
        <button
          type="button"
          v-bind="activatorProps"
          :class="triggerButtonClass"
          aria-label="Toggle theme customization"
          @click="handleTriggerInteraction"
          @focus="handleTriggerInteraction"
          @pointerenter.passive="handleTriggerInteraction"
        >
          <Icon
            name="lucide:paintbrush"
            size="16"
          />
        </button>
      </template>
      <VCard
        class="w-[min(33rem,90vw)] bg-background text-card-foreground rounded-xl"
        elevation="8"
      >
        <template v-if="shouldRenderCustomizer">
          <Suspense>
            <template #default>
              <ThemeCustomizer />
            </template>
            <template #fallback>
              <div class="flex items-center justify-center py-10 text-sm text-muted-foreground">
                Loading theme tools…
              </div>
            </template>
          </Suspense>
        </template>
        <div
          v-else
          class="flex items-center justify-center py-10 text-sm text-muted-foreground"
        >
          Preparing theme tools…
        </div>
      </VCard>
    </VMenu>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import Icon from "./Icon.vue";
import { uiButtonClass } from "~/utils/ui/button";

const props = defineProps<{ triggerClass?: string }>();

const triggerClass = computed(() => props.triggerClass ?? "");

const breakpoints = useBreakpoints(breakpointsTailwind);

const ThemeCustomizer = defineAsyncComponent(() => import("./ThemeCustomizer.vue"));

const shouldRenderCustomizer = ref(false);
const isMenuOpen = ref(false);

function ensureCustomizerReady() {
  if (shouldRenderCustomizer.value) {
    return;
  }

  shouldRenderCustomizer.value = true;
}

function handleTriggerInteraction() {
  ensureCustomizerReady();
}

const triggerButtonClass = computed(() =>
  uiButtonClass({
    variant: "ghost",
    size: "icon",
    className: triggerClass.value,
  }),
);

const disabledTriggerClass = computed(() =>
  uiButtonClass({
    variant: "ghost",
    size: "icon",
    className: [triggerClass.value, "cursor-not-allowed"],
  }),
);

const menuLocation = computed(() =>
  breakpoints.isGreaterOrEqual("md") ? "bottom end" : "bottom", 
);

watch(isMenuOpen, (open) => {
  if (open) {
    ensureCustomizerReady();
  }
});

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  const { requestIdleCallback } = window as Window & {
    requestIdleCallback?: (callback: () => void) => number;
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(ensureCustomizerReady);
    return;
  }

  window.setTimeout(ensureCustomizerReady, 1500);
});
</script>
