<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    sectionName?: string;
  }>(),
  {
    sectionName: "",
  },
);

const normalizedSectionName = computed(() => props.sectionName?.trim() ?? "");
</script>

<template>
  <v-container class="section-divider">
    <div
      class="section-divider__inner"
      role="separator"
      :aria-label="normalizedSectionName || undefined"
    >
      <span class="section-divider__stroke" aria-hidden="true" />
      <span v-if="normalizedSectionName" class="section-divider__label">
        <span class="section-divider__label-background" aria-hidden="true" />
        <span class="section-divider__label-text">{{ normalizedSectionName }}</span>
      </span>
    </div>
  </v-container>
</template>

<style scoped>
.section-divider {
  padding-block: clamp(36px, 5vw, 72px);
}

.section-divider__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}

.section-divider__stroke {
  position: absolute;
  inset-inline: 0;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-primary), 0) 0%,
    rgba(var(--v-theme-primary), 0.25) 12%,
    rgba(var(--v-theme-primary), 0.7) 50%,
    rgba(var(--v-theme-primary), 0.25) 88%,
    rgba(var(--v-theme-primary), 0) 100%
  );
  background-size: 200% 100%;
  animation: section-divider-flow 6s ease-in-out infinite;
  filter: drop-shadow(0 0 16px rgba(var(--v-theme-primary), 0.35));
}

.section-divider__label {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: clamp(20px, 6vw, 42px);
  min-height: 46px;
}

.section-divider__label-background {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.18),
    rgba(59, 130, 246, 0.08)
  );
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow:
    0 18px 42px -28px rgba(15, 23, 42, 0.95),
    0 0 0 1px rgba(var(--v-theme-primary), 0.18);
  backdrop-filter: blur(14px);
}

.section-divider__label-text {
  position: relative;
  font-size: 0.82rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.92);
  text-align: center;
}

@keyframes section-divider-flow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@media (max-width: 600px) {
  .section-divider {
    padding-block: clamp(28px, 8vw, 48px);
  }

  .section-divider__label {
    padding-inline: clamp(16px, 10vw, 32px);
    min-height: 40px;
  }

  .section-divider__label-text {
    font-size: 0.72rem;
    letter-spacing: 0.24em;
  }
}
</style>
