<template>
  <div class="page-transition-shell">
    <NuxtLayout>
      <Transition name="page-rotate" mode="out-in">
        <NuxtPage />
      </Transition>
    </NuxtLayout>
  </div>
</template>

<style>
.page-transition-shell {
  perspective: 1200px;
  min-height: 100dvh;
}

.page-rotate-enter-active,
.page-rotate-leave-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  transform-style: preserve-3d;
  transform-origin: center;
}

.page-rotate-enter-from {
  opacity: 0;
  transform: rotateY(45deg) translateZ(-120px);
}

.page-rotate-leave-to {
  opacity: 0;
  transform: rotateY(-45deg) translateZ(-120px);
}

.page-rotate-enter-to,
.page-rotate-leave-from {
  opacity: 1;
  transform: rotateY(0deg) translateZ(0);
}
</style>
