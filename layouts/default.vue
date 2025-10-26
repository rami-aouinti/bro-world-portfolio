<template>
  <div class="app-layout">
    <v-app class="app-layout__shell">
      <ParticlesBg
        class="app-layout__particles"
        :color="particlesColor"
        :quantity="160"
        :staticity="55"
        :ease="45"
      />
      <Navbar />
      <v-main class="app-layout__content">
        <div
          class="personal__background"
          aria-hidden="true"
        >
          <span class="personal__glow personal__glow--one"></span>
          <span class="personal__glow personal__glow--two"></span>
          <span class="personal__glow personal__glow--three"></span>
          <span class="personal__spark personal__spark--one"></span>
          <span class="personal__spark personal__spark--two"></span>
          <span class="personal__spark personal__spark--three"></span>
        </div>
        <slot />
      </v-main>
    </v-app>
  </div>
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
  height: 100vh;
  overflow: hidden;
}

.app-layout__shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout__content {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  overflow-y: auto;
}

.personal__glow {
  position: absolute;
  filter: blur(120px);
  opacity: 0.7;
  border-radius: 999px;
}

.personal__spark--one {
  background: rgba(59, 130, 246, 0.6);
  top: 28%;
  left: 18%;
  animation-delay: 0.4s;
}

.personal__spark--two {
  background: rgba(59, 130, 246, 0.6);
  top: 62%;
  right: 22%;
  animation-delay: 1.2s;
}

.personal__spark--three {
  background: rgba(59, 130, 246, 0.6);
  top: 48%;
  left: 72%;
  animation-delay: 2.4s;
}

.personal__spark {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.55);
  animation: twinkle 6s ease-in-out infinite;
}

.personal__glow--one {
  background: rgba(61, 27, 84, 0.6);
  height: 420px;
  width: 420px;
  top: -120px;
  left: -160px;
}

.personal__glow--two {
  background: rgba(89, 246, 221, 0.6);
  height: 320px;
  width: 320px;
  top: 180px;
  right: -140px;
}

.personal__glow--three {
  background: rgba(162, 21, 113, 0.6);
  height: 260px;
  width: 260px;
  bottom: 80px;
  left: 40%;
}

.personal__background {
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 0;
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
