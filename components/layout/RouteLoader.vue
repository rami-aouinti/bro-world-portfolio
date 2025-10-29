<template>
  <div
    class="route-loader"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="route-loader__surface">
      <div class="route-loader__beam" aria-hidden="true" />
      <div class="route-loader__content">
        <header class="route-loader__header">
          <span class="route-loader__bubble route-loader__shimmer" />
          <span class="route-loader__bubble route-loader__shimmer" />
          <span class="route-loader__bubble route-loader__shimmer" />
        </header>

        <div class="route-loader__hero">
          <span class="route-loader__line route-loader__line--lg route-loader__shimmer" />
          <span class="route-loader__line route-loader__line--md route-loader__shimmer" />
        </div>

        <div class="route-loader__grid">
          <article
            v-for="card in 3"
            :key="`route-card-${card}`"
            class="route-loader__card"
          >
            <span class="route-loader__line route-loader__line--sm route-loader__shimmer" />
            <span class="route-loader__line route-loader__line--xs route-loader__shimmer" />
            <div class="route-loader__chips">
              <span
                v-for="chip in 3"
                :key="`route-chip-${card}-${chip}`"
                class="route-loader__chip route-loader__shimmer"
              />
            </div>
          </article>
        </div>

        <div class="route-loader__progress">
          <span class="route-loader__progress-bar route-loader__shimmer" />
        </div>
      </div>
    </div>

    <div class="route-loader__message">
      <p class="route-loader__title">{{ loaderTitle }}</p>
      <p class="route-loader__subtitle">{{ loaderSubtitle }}</p>
    </div>

    <span class="sr-only">{{ ariaMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();

const loaderTitle = computed(() => (props.title ? props.title : t("app.routeLoader.title")));
const loaderSubtitle = computed(() =>
  props.subtitle ? props.subtitle : t("app.routeLoader.subtitle"),
);
const ariaMessage = computed(() => t("app.routeLoader.aria"));
</script>

<style scoped>
.route-loader {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 3vw, 28px);
  align-items: center;
  justify-content: center;
  min-height: min(70vh, 560px);
  padding: clamp(24px, 4vw, 48px);
  color: rgba(226, 232, 240, 0.9);
}

.route-loader__surface {
  position: relative;
  width: min(960px, 100%);
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: clamp(24px, 4vw, 32px);
  padding: clamp(24px, 4vw, 36px);
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(18px);
}

.route-loader__beam {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.18), transparent 55%),
    radial-gradient(circle at 75% 20%, rgba(56, 189, 248, 0.18), transparent 52%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.65));
  opacity: 0.9;
}

.route-loader__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 3vw, 28px);
}

.route-loader__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.route-loader__bubble {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.route-loader__hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.route-loader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(14px, 3vw, 24px);
}

.route-loader__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(16px, 3vw, 22px);
  border-radius: clamp(16px, 3vw, 22px);
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.route-loader__line {
  width: 100%;
  border-radius: 999px;
  height: 18px;
}

.route-loader__line--lg {
  height: clamp(26px, 4vw, 32px);
  max-width: 82%;
}

.route-loader__line--md {
  max-width: 68%;
}

.route-loader__line--sm {
  max-width: 72%;
}

.route-loader__line--xs {
  max-width: 58%;
  height: 14px;
}

.route-loader__chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.route-loader__chip {
  width: clamp(70px, 12vw, 100px);
  height: 22px;
  border-radius: 999px;
}

.route-loader__progress {
  width: 100%;
}

.route-loader__progress-bar {
  display: block;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(94, 234, 212, 0.24);
}

.route-loader__message {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.route-loader__title {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
}

.route-loader__subtitle {
  margin: 0;
  font-size: clamp(0.95rem, 2.4vw, 1.1rem);
  color: rgba(226, 232, 240, 0.72);
}

.route-loader__shimmer {
  position: relative;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.18);
}

.route-loader__shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(148, 163, 184, 0.12) 20%,
    rgba(255, 255, 255, 0.4) 45%,
    rgba(148, 163, 184, 0.12) 70%
  );
  animation: route-loader-shimmer 1.5s linear infinite;
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

@keyframes route-loader-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 720px) {
  .route-loader {
    padding: 24px 16px;
  }

  .route-loader__surface {
    padding: 24px;
  }

  .route-loader__grid {
    grid-template-columns: 1fr;
  }
}
</style>
