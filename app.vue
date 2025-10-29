<template>
  <div class="app-root">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Transition
      name="app-root__fade"
      mode="out-in"
      appear
    >
      <div
        v-if="!isAppReady"
        class="app-root__overlay app-root__overlay--app"
      >
        <AppLoader />
      </div>
    </Transition>

    <Transition name="app-root__fade">
      <div
        v-if="isRouteLoading && isAppReady"
        class="app-root__overlay app-root__overlay--route"
        aria-live="polite"
      >
        <RouteLoader />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isAppReady = useState<boolean>("app:ready", () => false);
const isRouteLoading = useState<boolean>("app:route-loading", () => false);
</script>

<style scoped>
.app-root {
  position: relative;
  min-height: 100vh;
}

.app-root__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.app-root__overlay--app {
  background: rgb(2 6 23 / 0.92);
}

.app-root__overlay--route {
  pointer-events: none;
  backdrop-filter: blur(4px);
}

.app-root__fade-enter-active,
.app-root__fade-leave-active {
  transition: opacity 180ms ease-in-out;
}

.app-root__fade-enter-from,
.app-root__fade-leave-to {
  opacity: 0;
}
</style>
