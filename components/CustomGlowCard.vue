<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type GlowCardProps = {
  title: string
  description: string
  eyebrow?: string
  badge?: string
  accentColor?: string
  background?: string
  glowColor?: string
  glowIntensity?: number
  padding?: string
  borderRadius?: string
  textColor?: string
  outlineColor?: string
  gradientSheenAngle?: number
  gradientSheenOpacity?: number
}

const props = withDefaults(defineProps<GlowCardProps>(), {
  eyebrow: undefined,
  badge: undefined,
  accentColor: '#7c3aed',
  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(124, 58, 237, 0.32) 100%)',
  glowColor: 'rgba(124, 58, 237, 0.55)',
  glowIntensity: 0.8,
  padding: '24px',
  borderRadius: '24px',
  textColor: '#f8fafc',
  outlineColor: 'rgba(148, 163, 184, 0.28)',
  gradientSheenAngle: 125,
  gradientSheenOpacity: 0.45
})

const cardRef = ref<HTMLElement | null>(null)

const cssVars = computed(() => ({
  '--card-accent': props.accentColor,
  '--card-background': props.background,
  '--card-padding': props.padding,
  '--card-border-radius': props.borderRadius,
  '--card-text-color': props.textColor,
  '--card-glow-color': props.glowColor,
  '--card-glow-opacity': props.glowIntensity.toString(),
  '--card-outline-color': props.outlineColor,
  '--card-sheen-angle': `${props.gradientSheenAngle}deg`,
  '--card-sheen-opacity': props.gradientSheenOpacity.toString()
}))

const initial = computed(() => props.title?.charAt(0)?.toUpperCase() ?? '')

const setPointerPosition = (event: PointerEvent) => {
  if (!cardRef.value) {
    return
  }

  const bounds = cardRef.value.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * 100
  const y = ((event.clientY - bounds.top) / bounds.height) * 100
  cardRef.value.style.setProperty('--pointer-x', `${x}%`)
  cardRef.value.style.setProperty('--pointer-y', `${y}%`)
}

const resetPointerPosition = () => {
  if (!cardRef.value) {
    return
  }

  cardRef.value.style.setProperty('--pointer-x', '50%')
  cardRef.value.style.setProperty('--pointer-y', '50%')
}

onMounted(() => {
  resetPointerPosition()
})
</script>

<template>
  <article
    ref="cardRef"
    class="glow-card"
    :style="cssVars"
    tabindex="0"
    @pointermove="setPointerPosition"
    @pointerleave="resetPointerPosition"
    @focus="resetPointerPosition"
  >
    <div class="glow-card__halo" aria-hidden="true" />
    <div class="glow-card__surface" aria-hidden="true" />

    <div class="glow-card__badge" v-if="badge">
      <span>{{ badge }}</span>
    </div>

    <div class="glow-card__content">
      <header class="glow-card__header">
        <div class="glow-card__avatar" aria-hidden="true">
          <span>{{ initial }}</span>
        </div>
        <div class="glow-card__headline">
          <p v-if="eyebrow" class="glow-card__eyebrow">{{ eyebrow }}</p>
          <h3 class="glow-card__title">{{ title }}</h3>
        </div>
      </header>

      <p class="glow-card__description">
        {{ description }}
      </p>

      <footer v-if="$slots.footer" class="glow-card__footer">
        <slot name="footer" />
      </footer>
    </div>
  </article>
</template>

<style scoped>
.glow-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.5vw, 24px);
  min-height: 100%;
  padding: var(--card-padding);
  border-radius: var(--card-border-radius);
  color: var(--card-text-color);
  background: var(--card-background);
  border: 1px solid var(--card-outline-color);
  overflow: hidden;
  transition: transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease;
  box-shadow: 0 25px 60px -35px rgba(15, 23, 42, 0.85);
}

.glow-card:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--card-accent) 60%, transparent);
  outline-offset: 4px;
}

.glow-card__surface,
.glow-card__halo {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.5s ease;
}

.glow-card__halo {
  z-index: -2;
  background: radial-gradient(
    circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    var(--card-glow-color),
    transparent 55%
  );
  filter: blur(22px);
}

.glow-card__surface {
  z-index: -1;
  background: linear-gradient(
    var(--card-sheen-angle),
    rgba(255, 255, 255, 0.35),
    transparent 55%
  );
  mix-blend-mode: screen;
}

.glow-card__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--card-accent) 85%, white 15%);
  background: color-mix(in srgb, var(--card-accent) 24%, transparent);
  border: 1px solid color-mix(in srgb, var(--card-accent) 50%, transparent);
  border-radius: 999px;
  padding: 6px 14px;
  backdrop-filter: blur(10px);
}

.glow-card__content {
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 2vw, 20px);
  z-index: 1;
}

.glow-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.glow-card__avatar {
  display: grid;
  place-items: center;
  height: 56px;
  width: 56px;
  flex-shrink: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 75%, #312e81 25%), rgba(15, 23, 42, 0.85));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 12px 25px -12px var(--card-accent);
  font-weight: 600;
  font-size: 1.5rem;
}

.glow-card__headline {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.glow-card__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--card-accent) 70%, white 30%);
}

.glow-card__title {
  margin: 0;
  font-size: clamp(1.1rem, 2.8vw, 1.5rem);
  font-weight: 600;
  line-height: 1.2;
}

.glow-card__description {
  margin: 0;
  font-size: clamp(0.95rem, 2.3vw, 1rem);
  line-height: 1.6;
  color: color-mix(in srgb, var(--card-text-color) 75%, black 25%);
}

.glow-card__footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--card-accent) 25%, transparent);
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--card-text-color) 80%, black 20%);
}

.glow-card:hover {
  transform: translateY(-6px) scale3d(1.01, 1.01, 1);
  box-shadow: 0 35px 70px -40px color-mix(in srgb, var(--card-accent) 55%, rgba(15, 23, 42, 0.9));
  border-color: color-mix(in srgb, var(--card-accent) 55%, transparent);
}

.glow-card:hover .glow-card__halo,
.glow-card:hover .glow-card__surface {
  opacity: var(--card-glow-opacity);
}

.glow-card:hover .glow-card__surface {
  opacity: var(--card-sheen-opacity);
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .glow-card,
  .glow-card__surface,
  .glow-card__halo {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  .glow-card:hover {
    transform: none;
  }
}
</style>
