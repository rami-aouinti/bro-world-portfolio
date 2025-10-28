<template>
  <v-card
    class="resume-preview"
    elevation="0"
    rounded="xl"
  >
    <v-card-item class="d-flex flex-column gap-2">
      <div class="d-flex align-center justify-space-between flex-wrap gap-3">
        <div>
          <v-card-title class="text-h5 font-weight-bold pa-0">Aperçu & export</v-card-title>
          <v-card-subtitle class="text-body-2 text-medium-emphasis pa-0 mt-1">
            Prévisualisez votre CV en direct. Le bouton d’export ouvre la boîte de dialogue d’impression du navigateur :
            choisissez « Enregistrer au format PDF » pour récupérer le document.
          </v-card-subtitle>
        </div>
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

      <v-alert
        type="info"
        variant="tonal"
        density="comfortable"
        class="mt-2"
        border="start"
        border-color="primary"
      >
        L’impression est optimisée pour le format A4. Ajustez la mise à l’échelle à 100 % si besoin.
      </v-alert>
    </v-card-item>

    <v-divider class="my-4" />

    <v-card-text>
      <client-only>
          <div class="resume-preview__stage">
            <div ref="previewRef" class="resume-preview__sheet">
            <component
              :is="currentTemplate"
              :data="resume"
              :colors="resume.colors"
            />
          </div>
        </div>
      </client-only>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

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

const componentsMap: Record<ResumeTemplateId, unknown> = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
  bold: TemplateBold,
  elegant: TemplateElegant,
};

const currentTemplate = computed(() => componentsMap[resume.value.template]);

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

.resume-preview__stage {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: auto;
  padding: 12px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), transparent 60%);
  border-radius: 24px;
}

.resume-preview__stage::-webkit-scrollbar {
  height: 12px;
}

.resume-preview__stage::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: rgba(30, 41, 59, 0.18);
}

.resume-preview__sheet {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.14);
  padding: 32px;
  color: #111827;
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
</style>
