<template>
  <CustomGlowCard
    class="resume-preview"
    title="Aperçu & export"
    eyebrow="Assistant CV"
    :variant="'indigo'"
    :heading-level="2"
  >
    <template #default>
      <div class="resume-preview__intro">
        <p class="resume-preview__description">
          Prévisualisez votre CV en direct. Ajustez le zoom, testez le mode mobile et exportez un PDF prêt à l’emploi.
        </p>

        <div class="resume-preview__controls">
          <div class="resume-preview__zoom">
            <span class="resume-preview__zoom-label">{{ zoomLabel }}</span>
            <div class="resume-preview__zoom-actions">
              <v-btn
                variant="text"
                icon="mdi-minus"
                density="comfortable"
                :disabled="!canZoomOut"
                @click="decreaseZoom"
              />
              <v-slider
                v-model="zoom"
                class="resume-preview__slider"
                :min="MIN_ZOOM"
                :max="MAX_ZOOM"
                :step="ZOOM_STEP"
                color="primary"
                hide-details
              />
              <v-btn
                variant="text"
                icon="mdi-plus"
                density="comfortable"
                :disabled="!canZoomIn"
                @click="increaseZoom"
              />
            </div>
          </div>

          <v-btn
            class="text-none"
            variant="tonal"
            :color="isMobilePreview ? 'primary' : undefined"
            prepend-icon="mdi-cellphone"
            @click="toggleMobilePreview"
          >
            {{ isMobilePreview ? 'Vue bureau' : 'Vue mobile' }}
          </v-btn>

          <v-btn
            color="primary"
            class="text-none"
            prepend-icon="mdi-file-download-outline"
            :loading="isExporting"
            @click="handleExport"
          >
            Exporter en PDF
          </v-btn>
        </div>
      </div>

      <div class="resume-preview__divider" />

      <client-only>
        <div class="resume-preview__stage">
          <div
            class="resume-preview__viewport"
            :class="{ 'resume-preview__viewport--mobile': isMobilePreview }"
          >
            <div
              class="resume-preview__scale"
              :style="scaleStyles"
            >
              <div
                ref="previewRef"
                class="resume-preview__sheet"
                :class="{ 'resume-preview__sheet--mobile': isMobilePreview }"
                :style="sheetStyles"
              >
                <component
                  :is="currentTemplate"
                  :data="resume"
                  :colors="resume.colors"
                />
              </div>
            </div>
          </div>
        </div>
        <v-expand-transition>
          <p
            v-if="isMobilePreview"
            class="resume-preview__mobile-hint"
          >
            L’aperçu mobile ajuste la largeur à 360px pour valider la lisibilité sur smartphone.
          </p>
        </v-expand-transition>
      </client-only>

      <div class="resume-preview__templates">
        <div class="resume-preview__templates-header">
          <h3>Templates disponibles</h3>
          <p>Choisissez le style qui vous ressemble puis personnalisez-le via la palette de couleurs.</p>
        </div>
        <v-slide-group
          v-model="templateModel"
          class="resume-preview__templates-group"
          show-arrows
          center-active
        >
          <v-slide-group-item
            v-for="template in resumeStore.templateOptions"
            :key="template.id"
            v-slot="{ isSelected, toggle }"
            :value="template.id"
          >
            <button
              type="button"
              class="resume-preview__template-card"
              :class="{ 'resume-preview__template-card--active': isSelected }"
              @click="toggle"
            >
              <span class="resume-preview__template-name">{{ template.name }}</span>
              <span class="resume-preview__template-description">{{ template.description }}</span>
            </button>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </template>
  </CustomGlowCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import CustomGlowCard from "~/components/CustomGlowCard.vue";

import TemplateBold from "~/components/resume/templates/TemplateBold.vue";
import TemplateClassic from "~/components/resume/templates/TemplateClassic.vue";
import TemplateElegant from "~/components/resume/templates/TemplateElegant.vue";
import TemplateMinimal from "~/components/resume/templates/TemplateMinimal.vue";
import TemplateModern from "~/components/resume/templates/TemplateModern.vue";
import { useResumeStore } from "~/stores/resume";
import type { ResumeTemplateId } from "~/types/resume";
import { exportResumeToPdf } from "~/utils/pdf/export-resume";

const resumeStore = useResumeStore();

const { resume } = storeToRefs(resumeStore);

const previewRef = ref<HTMLElement | null>(null);
const isExporting = ref(false);
const isMobilePreview = ref(false);
const zoom = ref(1);

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.05;

const componentsMap: Record<ResumeTemplateId, unknown> = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
  bold: TemplateBold,
  elegant: TemplateElegant,
};

const currentTemplate = computed(() => componentsMap[resume.value.template]);

const templateModel = computed({
  get: () => resume.value.template,
  set: (value) => {
    resumeStore.setTemplate(value as ResumeTemplateId);
  },
});

const scaleStyles = computed(() => ({
  transform: `scale(${zoom.value})`,
  transformOrigin: "top center",
}));

const sheetStyles = computed(() =>
  isMobilePreview.value
    ? {
        width: "360px",
        minHeight: "auto",
      }
    : {},
);

const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`);
const canZoomOut = computed(() => zoom.value > MIN_ZOOM + 0.01);
const canZoomIn = computed(() => zoom.value < MAX_ZOOM - 0.01);

function clampZoom(value: number) {
  return Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);
}

function increaseZoom() {
  zoom.value = clampZoom(zoom.value + ZOOM_STEP);
}

function decreaseZoom() {
  zoom.value = clampZoom(zoom.value - ZOOM_STEP);
}

function toggleMobilePreview() {
  isMobilePreview.value = !isMobilePreview.value;
  zoom.value = isMobilePreview.value ? clampZoom(0.9) : 1;
}

async function handleExport() {
  if (!previewRef.value) {
    return;
  }

  try {
    isExporting.value = true;
    await exportResumeToPdf(previewRef.value, {
      title: `${resume.value.personal.firstName}-${resume.value.personal.lastName}-cv`,
      styles: `.resume-template {
        width: 100%;
        min-height: auto;
        box-shadow: none !important;
      }`,
    });
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
.resume-preview {
  display: flex;
  flex-direction: column;
}

.resume-preview__intro {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
}

.resume-preview__description {
  flex: 1 1 320px;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in srgb, var(--card-text-color, #f8fafc) 78%, rgba(15, 23, 42, 0.55) 22%);
}

.resume-preview__divider {
  width: 100%;
  height: 1px;
  margin: 20px 0 28px;
  background: color-mix(in srgb, var(--card-accent, #2563eb) 22%, transparent);
}

.resume-preview__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.resume-preview__zoom {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
  backdrop-filter: blur(12px);
}

.resume-preview__zoom-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(30, 41, 59, 0.8);
}

.resume-preview__zoom-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 160px;
}

.resume-preview__slider {
  flex: 1 1 0;
  max-width: 160px;
}

.resume-preview__stage {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: auto;
  padding: 18px;
  border-radius: 28px;
  position: relative;
  background:
    linear-gradient(135deg, rgba(79, 70, 229, 0.1), transparent 60%),
    linear-gradient(45deg, rgba(148, 163, 184, 0.08), transparent 70%);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.resume-preview__stage::-webkit-scrollbar {
  height: 12px;
}

.resume-preview__stage::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: rgba(30, 41, 59, 0.18);
}

.resume-preview__viewport {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 360px;
}

.resume-preview__viewport--mobile {
  max-width: 420px;
}

.resume-preview__scale {
  transition: transform 0.2s ease;
}

.resume-preview__sheet {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  border-radius: 22px;
  box-shadow:
    0 30px 50px -24px rgba(15, 23, 42, 0.22),
    0 1px 0 rgba(148, 163, 184, 0.25);
  padding: 32px;
  color: #111827;
  transition: width 0.25s ease, min-height 0.25s ease, padding 0.2s ease;
}

.resume-preview__sheet--mobile {
  padding: 28px 24px;
}

@media (max-width: 1280px) {
  .resume-preview__sheet {
    width: 100%;
  }
}

@media (max-width: 960px) {
  .resume-preview__sheet {
    padding: 24px;
  }
}

.resume-preview__mobile-hint {
  margin-top: 16px;
  font-size: 0.9rem;
  color: rgba(71, 85, 105, 0.8);
}

.resume-preview__templates {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-preview__templates-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.resume-preview__templates-header p {
  margin: 4px 0 0;
  font-size: 0.92rem;
  color: rgba(71, 85, 105, 0.8);
}

.resume-preview__templates-group {
  --v-slide-group-padding: 0;
}

.resume-preview__template-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(226, 232, 240, 0.45);
  border: 1px solid transparent;
  color: #0f172a;
  text-align: left;
  transition: border 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.resume-preview__template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px -24px rgba(15, 23, 42, 0.4);
}

.resume-preview__template-card--active {
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 18px 38px -24px rgba(59, 130, 246, 0.5);
  background: rgba(191, 219, 254, 0.45);
}

.resume-preview__template-name {
  font-weight: 600;
  font-size: 1rem;
}

.resume-preview__template-description {
  font-size: 0.85rem;
  color: rgba(51, 65, 85, 0.85);
}

@media (max-width: 960px) {
  .resume-preview__controls {
    justify-content: flex-start;
  }

  .resume-preview__zoom {
    width: 100%;
  }
}
</style>
