<template>
  <div class="design-controls">
    <div class="design-controls__header">
      <div>
        <p class="design-controls__eyebrow">{{ translate('admin.design.controls.eyebrow', 'Options de design') }}</p>
        <h2 class="design-controls__title">{{ translate('admin.design.controls.title', 'Affinez votre thème') }}</h2>
        <p class="design-controls__subtitle">
          {{ translate('admin.design.controls.subtitle', 'Personnalisez l\'apparence de votre espace administrateur en temps réel.') }}
        </p>
      </div>
      <div class="design-controls__preview" aria-hidden="true">
        <div class="design-controls__preview-card">
          <div class="design-controls__preview-glow" />
          <div class="design-controls__preview-row" />
          <div class="design-controls__preview-row" />
          <div class="design-controls__preview-footer" />
        </div>
      </div>
    </div>

    <v-divider class="design-controls__divider" />

    <div class="design-controls__grid">
      <section class="design-controls__section">
        <header class="design-controls__section-header">
          <h3 class="design-controls__section-title">
            {{ translate('admin.design.controls.glass.title', 'Intensité du verre') }}
          </h3>
          <p class="design-controls__section-description">
            {{ translate('admin.design.controls.glass.description', 'Ajustez la profondeur de l\'effet glassmorphism appliqué aux panneaux.') }}
          </p>
        </header>
        <div class="design-controls__options">
          <v-btn-toggle
            v-model="glassValue"
            class="design-controls__toggle"
            mandatory
            rounded="xl"
          >
            <v-btn
              v-for="option in glassOptions"
              :key="option.value"
              :value="option.value"
              class="design-controls__toggle-btn"
              variant="outlined"
              size="large"
            >
              <div class="design-controls__toggle-content">
                <span class="design-controls__toggle-label">{{ option.label }}</span>
                <span class="design-controls__toggle-helper">{{ option.helper }}</span>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>
      </section>

      <section class="design-controls__section">
        <header class="design-controls__section-header">
          <h3 class="design-controls__section-title">
            {{ translate('admin.design.controls.corners.title', 'Style des angles') }}
          </h3>
          <p class="design-controls__section-description">
            {{ translate('admin.design.controls.corners.description', 'Définissez la rondeur des cartes et du dock de navigation.') }}
          </p>
        </header>
        <div class="design-controls__options">
          <v-btn-toggle
            v-model="cornerValue"
            class="design-controls__toggle"
            mandatory
            rounded="xl"
          >
            <v-btn
              v-for="option in cornerOptions"
              :key="option.value"
              :value="option.value"
              class="design-controls__toggle-btn"
              variant="outlined"
              size="large"
            >
              <div class="design-controls__toggle-content">
                <span class="design-controls__toggle-label">{{ option.label }}</span>
                <span class="design-controls__toggle-helper">{{ option.helper }}</span>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>
      </section>

      <section class="design-controls__section design-controls__section--toggles">
        <header class="design-controls__section-header">
          <h3 class="design-controls__section-title">
            {{ translate('admin.design.controls.effects.title', 'Effets visuels') }}
          </h3>
          <p class="design-controls__section-description">
            {{ translate('admin.design.controls.effects.description', 'Activez ou désactivez les éléments décoratifs pour obtenir un rendu sobre ou immersif.') }}
          </p>
        </header>
        <div class="design-controls__switches">
          <v-switch
            v-model="accentGlow"
            inset
            color="primary"
            :label="translate('admin.design.controls.effects.glow', 'Garder les halos lumineux')"
            class="design-controls__switch"
          />
          <v-switch
            v-model="showGrid"
            inset
            color="primary"
            :label="translate('admin.design.controls.effects.grid', 'Afficher la grille décorative')"
            class="design-controls__switch"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  useAdminDesignSettings,
  type AdminCornerStyle,
  type AdminGlassIntensity,
} from "~/composables/useAdminDesignSettings";

const { settings, updateSetting } = useAdminDesignSettings();
const { t } = useI18n();

const glassOptions = computed(() => [
  {
    value: "subtle" as AdminGlassIntensity,
    label: translate("admin.design.controls.glass.subtle", "Doux"),
    helper: translate("admin.design.controls.glass.subtleHelper", "Flou léger et discret"),
  },
  {
    value: "balanced" as AdminGlassIntensity,
    label: translate("admin.design.controls.glass.balanced", "Équilibré"),
    helper: translate("admin.design.controls.glass.balancedHelper", "Équilibre idéal entre contraste et flou"),
  },
  {
    value: "bold" as AdminGlassIntensity,
    label: translate("admin.design.controls.glass.bold", "Audacieux"),
    helper: translate("admin.design.controls.glass.boldHelper", "Effet intense et très lumineux"),
  },
]);

const cornerOptions = computed(() => [
  {
    value: "rounded" as AdminCornerStyle,
    label: translate("admin.design.controls.corners.rounded", "Arrondi"),
    helper: translate("admin.design.controls.corners.roundedHelper", "Courbes modernes et harmonieuses"),
  },
  {
    value: "pill" as AdminCornerStyle,
    label: translate("admin.design.controls.corners.pill", "Capsule"),
    helper: translate("admin.design.controls.corners.pillHelper", "Angles totalement arrondis"),
  },
  {
    value: "square" as AdminCornerStyle,
    label: translate("admin.design.controls.corners.square", "Structuré"),
    helper: translate("admin.design.controls.corners.squareHelper", "Angles francs pour plus de sobriété"),
  },
]);

const glassValue = computed({
  get: () => settings.value.glassIntensity,
  set: (value) => updateSetting("glassIntensity", value as AdminGlassIntensity),
});

const cornerValue = computed({
  get: () => settings.value.cornerStyle,
  set: (value) => updateSetting("cornerStyle", value as AdminCornerStyle),
});

const accentGlow = computed({
  get: () => settings.value.accentGlow,
  set: (value) => updateSetting("accentGlow", value),
});

const showGrid = computed({
  get: () => settings.value.showGrid,
  set: (value) => updateSetting("showGrid", value),
});

function translate(key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}
</script>

<style scoped>
.design-controls {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 28px;
  border-radius: calc(var(--admin-surface-radius, 28px) - 6px);
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.88)) 92%, transparent);
  border: 1px solid var(--admin-glass-border, rgba(148, 163, 184, 0.25));
  box-shadow:
    0 28px 60px -40px var(--admin-surface-shadow, rgba(15, 23, 42, 0.75)),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  position: relative;
  overflow: hidden;
}

.design-controls::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 15% 20%,
    rgba(37, 99, 235, 0.35) var(--admin-accent-glow-opacity, 1),
    transparent 60%
  );
  pointer-events: none;
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.design-controls__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  position: relative;
  z-index: 1;
}

.design-controls__eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: rgba(191, 219, 254, 0.85);
}

.design-controls__title {
  margin: 0 0 10px;
  font-size: clamp(1.65rem, 2.4vw, 2rem);
  color: rgb(226, 232, 240);
}

.design-controls__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
  max-width: 420px;
}

.design-controls__preview {
  flex: 0 0 auto;
  width: 220px;
  position: relative;
}

.design-controls__preview-card {
  position: relative;
  border-radius: calc(var(--admin-surface-radius, 28px) - 4px);
  border: 1px solid color-mix(in srgb, var(--admin-glass-border, rgba(148, 163, 184, 0.25)) 90%, transparent);
  background: color-mix(in srgb, var(--admin-glass-surface, rgba(15, 23, 42, 0.88)) 96%, transparent);
  padding: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 45px -35px var(--admin-surface-shadow, rgba(15, 23, 42, 0.75)),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.design-controls__preview-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 25%, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.25), transparent 60%);
  opacity: var(--admin-accent-glow-opacity, 1);
  transition: opacity 0.3s ease;
}

.design-controls__preview-row,
.design-controls__preview-footer {
  position: relative;
  z-index: 1;
  height: 12px;
  border-radius: 999px;
  background: rgba(191, 219, 254, 0.35);
}

.design-controls__preview-row + .design-controls__preview-row {
  margin-top: 12px;
}

.design-controls__preview-footer {
  margin-top: 24px;
  height: 40px;
  background: rgba(59, 130, 246, 0.45);
}

.design-controls__divider {
  opacity: 0.25;
  border-color: rgba(148, 163, 184, 0.2) !important;
}

.design-controls__grid {
  display: grid;
  gap: 32px;
  position: relative;
  z-index: 1;
}

.design-controls__section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.design-controls__section-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.design-controls__section-title {
  margin: 0;
  color: rgb(226, 232, 240);
  font-size: 1.1rem;
  font-weight: 600;
}

.design-controls__section-description {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
}

.design-controls__options {
  display: flex;
}

.design-controls__toggle {
  width: 100%;
  border-radius: calc(var(--admin-surface-radius, 28px) - 12px);
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 10px;
}

.design-controls__toggle-btn {
  flex: 1 1 0;
  border-radius: calc(var(--admin-surface-radius, 28px) - 18px);
  border-color: transparent !important;
  background: rgba(148, 163, 184, 0.08);
  color: rgb(226, 232, 240);
  text-transform: none;
  letter-spacing: 0.02em;
  min-height: 68px;
  transition: transform 0.3s ease;
}

.design-controls__toggle-btn.v-btn--active {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.45) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 16px 32px -25px rgba(59, 130, 246, 0.75);
  transform: translateY(-4px);
}

.design-controls__toggle-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.design-controls__toggle-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.design-controls__toggle-helper {
  font-size: 0.82rem;
  color: rgba(226, 232, 240, 0.7);
}

.design-controls__switches {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.design-controls__switch {
  --v-theme-overlay-multiplier: 0;
  background: rgba(15, 23, 42, 0.55);
  border-radius: calc(var(--admin-surface-radius, 28px) - 16px);
  padding-inline: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: rgb(226, 232, 240);
}

.design-controls__switch :deep(.v-label) {
  font-weight: 500;
  letter-spacing: 0.02em;
}

.design-controls__section--toggles {
  gap: 24px;
}

@media (max-width: 960px) {
  .design-controls {
    padding: 22px;
  }

  .design-controls__header {
    flex-direction: column;
  }

  .design-controls__preview {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .design-controls__toggle {
    flex-direction: column;
    gap: 10px;
  }

  .design-controls__toggle-btn {
    width: 100%;
  }
}
</style>
