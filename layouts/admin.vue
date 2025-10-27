<template>
  <v-app>
    <v-main class="app-layout">
      <ParticlesBg
        class="app-layout__particles"
        :color="particlesColor"
        :quantity="160"
        :staticity="55"
        :ease="45"
      />
      <div
        v-if="showGridOverlay"
        class="app-layout__grid"
        aria-hidden="true"
      />
      <AdminNavbar />
      <div class="app-layout__content">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AdminNavbar from "~/components/admin/AdminNavbar.vue";
import { ParticlesBg } from "~/components/ui/particles-bg";
import { useCookieColorMode } from "~/composables/useCookieColorMode";
import { useAdminDesignSettings } from "~/composables/useAdminDesignSettings";

const colorMode = useCookieColorMode();
const { settings: designSettings } = useAdminDesignSettings();

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
const showGridOverlay = computed(() => designSettings.value.showGrid);
</script>

<style scoped>
:global(:root) {
  --admin-glass-blur: 18px;
  --admin-glass-surface: rgba(15, 23, 42, 0.88);
  --admin-glass-border: rgba(148, 163, 184, 0.25);
  --admin-surface-shadow: rgba(15, 23, 42, 0.75);
  --admin-surface-radius: 28px;
  --admin-control-radius: 999px;
  --admin-accent-glow-opacity: 1;
}

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

.app-layout__grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      rgba(148, 163, 184, 0.15) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.15) 1px,
      transparent 1px
    );
  background-size: 120px 120px;
  opacity: 0.16;
  mix-blend-mode: overlay;
  transition: opacity 0.4s ease;
}
</style>
