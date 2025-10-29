<template>
  <div
    class="app-loader"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div
      class="app-loader__background"
      aria-hidden="true"
    >
      <span class="app-loader__glow app-loader__glow--one" />
      <span class="app-loader__glow app-loader__glow--two" />
      <span class="app-loader__glow app-loader__glow--three" />
      <span class="app-loader__spark app-loader__spark--one" />
      <span class="app-loader__spark app-loader__spark--two" />
      <span class="app-loader__spark app-loader__spark--three" />
    </div>

    <div class="app-loader__shell">
      <header class="app-loader__navbar">
        <div class="app-loader__dock">
          <span
            v-for="icon in 5"
            :key="`dock-icon-${icon}`"
            class="app-loader__dock-item app-loader__shimmer"
          />
          <span class="app-loader__dock-separator" />
          <span class="app-loader__dock-control app-loader__shimmer" />
          <span class="app-loader__dock-control app-loader__shimmer" />
        </div>
      </header>

      <main class="app-loader__content">
        <section class="app-loader__hero">
          <div class="app-loader__hero-avatar app-loader__shimmer" />
          <div class="app-loader__hero-text">
            <span class="app-loader__hero-badge app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--xl app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--lg app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--md app-loader__shimmer" />
            <div class="app-loader__hero-chips">
              <span
                v-for="chip in 3"
                :key="`chip-${chip}`"
                class="app-loader__chip app-loader__shimmer"
              />
            </div>
          </div>
        </section>

        <section class="app-loader__grid">
          <article
            v-for="card in 3"
            :key="`card-${card}`"
            class="app-loader__card"
          >
            <div class="app-loader__card-header">
              <span class="app-loader__dot app-loader__shimmer" />
              <span class="app-loader__dot app-loader__shimmer" />
              <span class="app-loader__dot app-loader__shimmer" />
            </div>
            <span class="app-loader__line app-loader__line--lg app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--md app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--sm app-loader__shimmer" />
            <div class="app-loader__pill-group">
              <span
                v-for="pill in 3"
                :key="`pill-${card}-${pill}`"
                class="app-loader__pill app-loader__shimmer"
              />
            </div>
          </article>
        </section>

        <section class="app-loader__cta">
          <div class="app-loader__cta-text">
            <span class="app-loader__line app-loader__line--lg app-loader__shimmer" />
            <span class="app-loader__line app-loader__line--md app-loader__shimmer" />
          </div>
          <div class="app-loader__cta-actions">
            <span class="app-loader__button app-loader__button--primary app-loader__shimmer" />
            <span class="app-loader__button app-loader__button--ghost app-loader__shimmer" />
          </div>
        </section>
      </main>

      <footer class="app-loader__footer">
        <h1 class="app-loader__title">{{ t("app.loader.title") }}</h1>
        <p class="app-loader__subtitle">{{ t("app.loader.subtitle") }}</p>
      </footer>
    </div>

    <span class="sr-only">{{ t("app.loader.aria") }}</span>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style scoped>
.app-loader {
  position: relative;
  min-height: 100vh;
  padding: clamp(24px, 5vw, 48px) clamp(16px, 6vw, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(147, 51, 234, 0.18), transparent 52%),
    radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1), transparent 60%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.96));
  overflow: hidden;
  color: rgba(226, 232, 240, 0.92);
}

.app-loader__shell {
  position: relative;
  z-index: 1;
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 40px);
}

.app-loader__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.app-loader__glow {
  position: absolute;
  filter: blur(120px);
  opacity: 0.6;
  border-radius: 999px;
}

.app-loader__glow--one {
  background: rgba(61, 27, 84, 0.7);
  width: 420px;
  height: 420px;
  top: -120px;
  left: -160px;
}

.app-loader__glow--two {
  background: rgba(89, 246, 221, 0.5);
  width: 320px;
  height: 320px;
  top: 140px;
  right: -180px;
}

.app-loader__glow--three {
  background: rgba(162, 21, 113, 0.55);
  width: 280px;
  height: 280px;
  bottom: 60px;
  left: 40%;
}

.app-loader__spark {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.55);
  animation: app-loader-twinkle 6s ease-in-out infinite;
}

.app-loader__spark--one {
  top: 28%;
  left: 18%;
  animation-delay: 0.4s;
}

.app-loader__spark--two {
  top: 62%;
  right: 22%;
  animation-delay: 1.2s;
}

.app-loader__spark--three {
  top: 48%;
  left: 72%;
  animation-delay: 2.2s;
}

.app-loader__navbar {
  display: flex;
  justify-content: center;
}

.app-loader__dock {
  display: inline-flex;
  align-items: center;
  gap: clamp(10px, 2vw, 18px);
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 32px);
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 999px;
  backdrop-filter: blur(18px);
}

.app-loader__dock-item {
  width: clamp(42px, 8vw, 56px);
  height: clamp(42px, 8vw, 56px);
  border-radius: 50%;
}

.app-loader__dock-separator {
  width: 1px;
  height: clamp(32px, 5vw, 40px);
  background: rgba(148, 163, 184, 0.24);
}

.app-loader__dock-control {
  width: clamp(44px, 8vw, 52px);
  height: clamp(44px, 8vw, 52px);
  border-radius: 18px;
}

.app-loader__content {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 48px);
  padding: clamp(24px, 4vw, 48px);
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: clamp(24px, 4vw, 36px);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(22px);
}

.app-loader__hero {
  display: grid;
  grid-template-columns: clamp(120px, 18vw, 168px) 1fr;
  gap: clamp(18px, 3vw, 32px);
  align-items: center;
}

.app-loader__hero-avatar {
  aspect-ratio: 1;
  border-radius: clamp(24px, 5vw, 32px);
  background: rgba(255, 255, 255, 0.04);
}

.app-loader__hero-text {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 20px);
}

.app-loader__hero-badge {
  width: clamp(96px, 16vw, 128px);
  height: clamp(24px, 4vw, 32px);
  border-radius: 999px;
  align-self: flex-start;
}

.app-loader__hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.app-loader__chip {
  width: clamp(82px, 14vw, 118px);
  height: 28px;
  border-radius: 999px;
}

.app-loader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(16px, 3vw, 24px);
}

.app-loader__card {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 18px);
  padding: clamp(18px, 3vw, 24px);
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: clamp(18px, 3vw, 24px);
}

.app-loader__card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-loader__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.app-loader__line {
  width: 100%;
  height: 18px;
  border-radius: 999px;
}

.app-loader__line--xl {
  height: clamp(34px, 5vw, 44px);
  max-width: 92%;
}

.app-loader__line--lg {
  height: clamp(26px, 4vw, 34px);
  max-width: 84%;
}

.app-loader__line--md {
  height: 20px;
  max-width: 72%;
}

.app-loader__line--sm {
  height: 16px;
  max-width: 64%;
}

.app-loader__pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.app-loader__pill {
  width: clamp(80px, 14vw, 110px);
  height: 24px;
  border-radius: 999px;
}

.app-loader__cta {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(18px, 3vw, 32px);
  align-items: center;
  justify-content: space-between;
}

.app-loader__cta-text {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 18px);
  flex: 1 1 240px;
}

.app-loader__cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-end;
}

.app-loader__button {
  width: clamp(160px, 28vw, 220px);
  height: 44px;
  border-radius: 999px;
}

.app-loader__button--primary {
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.85), rgba(56, 189, 248, 0.75));
}

.app-loader__button--ghost {
  background: rgba(94, 234, 212, 0.18);
}

.app-loader__footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: rgba(226, 232, 240, 0.92);
}

.app-loader__title {
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.app-loader__subtitle {
  margin: 0;
  font-size: clamp(0.95rem, 2.2vw, 1.125rem);
  color: rgba(226, 232, 240, 0.75);
}

.app-loader__shimmer {
  position: relative;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.18);
}

.app-loader__shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(148, 163, 184, 0.1) 20%,
    rgba(255, 255, 255, 0.35) 45%,
    rgba(148, 163, 184, 0.1) 70%
  );
  animation: app-loader-shimmer 1.6s linear infinite;
  transform: translateX(-100%);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes app-loader-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes app-loader-twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@media (max-width: 960px) {
  .app-loader {
    padding: 32px 18px;
  }

  .app-loader__hero {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .app-loader__hero-avatar {
    width: clamp(120px, 38vw, 180px);
    margin: 0 auto;
  }

  .app-loader__hero-badge {
    align-self: center;
  }

  .app-loader__hero-chips {
    justify-content: center;
  }

  .app-loader__cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-loader__cta-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
