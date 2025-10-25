<template>
  <v-app class="app-layout">
    <ParticlesBg
      class="app-layout__particles"
      :color="particlesColor"
      :quantity="160"
      :staticity="55"
      :ease="45"
    />
    <Navbar />
    <v-main class="app-layout__content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import { ParticlesBg } from "~/components/ui/particles-bg";
import { useCookieColorMode } from "~/composables/useCookieColorMode";

const colorMode = useCookieColorMode();

const isDark = computed(() => {
  if (colorMode.value === "dark") {
    return true;
  }

  if (colorMode.value === "light") {
    return false;
  }

  return colorMode.system?.value === "dark";
});

const particlesColor = computed(() => (isDark.value ? "#FFFFFF" : "#0F172A"));
</script>

<style scoped>
.app-layout {
  position: relative;
  min-height: 100vh;
}

.app-layout__content {
  position: relative;
  z-index: 1;
}

.app-layout__particles {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
