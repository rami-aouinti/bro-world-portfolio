<template>
  <div class="app-layout">
    <v-app class="app-layout__shell">
      <component
        :is="LazyParticlesBg"
        v-if="showParticles"
        class="app-layout__particles"
        :color="particlesColor"
        :quantity="particleQuantity"
        :staticity="55"
        :ease="45"
        aria-hidden="true"
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
      <button
        v-if="isHydrated"
        type="button"
        class="app-layout__scroll-top"
        :class="{ 'app-layout__scroll-top--visible': !isAtTop }"
        aria-label="Revenir en haut de la page"
        @click="scrollToTop"
      >
        <v-icon
          icon="mdi-arrow-up"
          class="app-layout__scroll-top-icon"
          size="28"
          aria-hidden="true"
        />
        <span class="sr-only">Revenir en haut de la page</span>
      </button>
    </v-app>
  </div>
  <Analytics />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { usePreferredReducedMotion, useWindowSize } from "@vueuse/core";
import Navbar from "~/components/layout/Navbar.vue";
import { useCookieColorMode } from "~/composables/useCookieColorMode";
import { Analytics } from "@vercel/analytics/nuxt";

const colorMode = useCookieColorMode();
const prefersReducedMotion = usePreferredReducedMotion();
const { width } = useWindowSize();
const isHydrated = ref(false);
const shouldRenderParticles = ref(false);
const pendingIdleHandle = ref<number | null>(null);
const allowParticles = computed(() => width.value >= 640);
const isAtTop = ref(true);

const LazyParticlesBg = defineAsyncComponent({
  loader: () => import("~/components/ui/particles-bg").then((module) => module.ParticlesBg),
  suspensible: false,
});

function scheduleParticlesRender() {
  if (shouldRenderParticles.value || pendingIdleHandle.value !== null || !allowParticles.value) {
    return;
  }

  function enableParticles() {
    shouldRenderParticles.value = true;
    pendingIdleHandle.value = null;
  }

  if (import.meta.client && "requestIdleCallback" in window) {
    pendingIdleHandle.value = (
      window as Window & {
        requestIdleCallback: (callback: () => void, options?: { timeout?: number }) => number;
      }
    ).requestIdleCallback(enableParticles, { timeout: 350 });
  } else if (import.meta.client) {
    pendingIdleHandle.value = window.setTimeout(() => enableParticles(), 180);
  }
}

function cancelScheduledParticles() {
  if (!import.meta.client || pendingIdleHandle.value === null) {
    return;
  }

  if ("cancelIdleCallback" in window) {
    (window as Window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback(
      pendingIdleHandle.value,
    );
  } else {
    window.clearTimeout(pendingIdleHandle.value);
  }

  pendingIdleHandle.value = null;
}

function updateScrollState() {
  if (!import.meta.client) {
    return;
  }

  isAtTop.value = window.scrollY <= 48;
}

onMounted(() => {
  isHydrated.value = true;

  if (!prefersReducedMotion.value && allowParticles.value) {
    scheduleParticlesRender();
  }

  if (import.meta.client) {
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
  }
});

onBeforeUnmount(() => {
  cancelScheduledParticles();

  if (import.meta.client) {
    window.removeEventListener("scroll", updateScrollState);
  }
});

watch(prefersReducedMotion, (prefers) => {
  if (prefers) {
    cancelScheduledParticles();
    shouldRenderParticles.value = false;
    return;
  }

  if (isHydrated.value && allowParticles.value) {
    scheduleParticlesRender();
  }
});

watch(allowParticles, (allowed) => {
  if (!allowed) {
    cancelScheduledParticles();
    shouldRenderParticles.value = false;
    return;
  }

  if (isHydrated.value && !prefersReducedMotion.value) {
    scheduleParticlesRender();
  }
});

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
const particleQuantity = computed(() => {
  if (width.value < 640) {
    return 60;
  }

  if (width.value < 1280) {
    return 120;
  }

  return 160;
});

const showParticles = computed(
  () =>
    isHydrated.value &&
    shouldRenderParticles.value &&
    !prefersReducedMotion.value &&
    allowParticles.value,
);

function scrollToTop() {
  if (!import.meta.client) {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<style scoped>
.app-layout {
  position: relative;
  min-height: 100dvh;
}

.app-layout__shell {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-layout__content {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  overflow-x: clip;
}

@supports not (overflow: clip) {
  .app-layout__content {
    overflow-x: hidden;
  }
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

.app-layout__scroll-top {
  position: fixed;
  inset-block-end: clamp(16px, 3vw, 32px);
  inset-inline-end: clamp(16px, 3vw, 32px);
  width: clamp(48px, 10vw, 64px);
  height: clamp(48px, 10vw, 64px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.35));
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  padding: 0;
  margin: 0;
  color: #e2e8f0;
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(16px);
  opacity: 0;
  pointer-events: none;
  cursor: pointer;
  z-index: 10;
  transform: translateY(12px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.app-layout__scroll-top--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.app-layout__scroll-top:hover,
.app-layout__scroll-top:focus-visible {
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.45), rgba(59, 130, 246, 0.3));
  color: #0f172a;
}

.app-layout__scroll-top:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 4px;
}

.app-layout__scroll-top-icon {
  color: currentColor;
}
</style>
