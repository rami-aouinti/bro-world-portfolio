<script setup lang="ts">
import { computed } from 'vue'

import { resolveLocalizedRouteTarget } from '~/utils/i18n/resolve-target'

const props = withDefaults(
  defineProps<{
    label: string
    to: string
    variant?: string
  }>(),
  {
    variant: 'primary'
  }
)

const localePath = useLocalePath()

const to = computed(() => resolveLocalizedRouteTarget(props.to, localePath))

const appearance = computed(() =>
  props.variant === 'btn-dark' ? 'app-button--ghost' : 'app-button--primary',
)
</script>

<template>
  <v-btn
    :to="to"
    variant="flat"
    rounded="pill"
    class="app-button text-none"
    :class="appearance"
  >
    {{ props.label }}
  </v-btn>
</template>

<style scoped>
.app-button {
  align-items: center;
  border: 1px solid transparent;
  box-shadow: none;
  color: #e2e8f0;
  display: inline-flex;
  font-size: 0.95rem;
  font-weight: 600;
  height: 52px;
  letter-spacing: 0.045em;
  min-width: auto;
  padding-inline: clamp(20px, 5vw, 32px);
  text-transform: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease,
    border-color 0.25s ease, background 0.25s ease;
}

.app-button--primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow: 0 18px 46px -20px rgba(99, 102, 241, 0.8);
  color: #f8fafc;
}

.app-button--primary:hover,
.app-button--primary:focus-visible {
  box-shadow: 0 22px 52px -20px rgba(129, 140, 248, 0.85);
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.app-button--ghost {
  backdrop-filter: blur(14px);
  background: rgba(15, 23, 42, 0.55);
  border-color: rgba(148, 163, 184, 0.35);
  box-shadow: 0 18px 42px -26px rgba(15, 23, 42, 0.9);
  color: rgba(226, 232, 240, 0.92);
}

.app-button--ghost:hover,
.app-button--ghost:focus-visible {
  background: rgba(15, 23, 42, 0.72);
  border-color: rgba(148, 163, 184, 0.6);
  transform: translateY(-2px);
}

.app-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35),
    0 22px 52px -20px rgba(129, 140, 248, 0.65);
}

@media (max-width: 600px) {
  .app-button {
    font-size: 0.9rem;
    height: 48px;
    letter-spacing: 0.04em;
    padding-inline: clamp(18px, 6vw, 28px);
  }
}
</style>
