<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    @update:model-value="emitClose"
  >
    <v-card
      class="resource-dialog"
      rounded="xl"
    >
      <v-card-title class="resource-dialog__title">
        {{ title }}
      </v-card-title>
      <v-card-subtitle class="resource-dialog__subtitle">
        {{ helperText }}
      </v-card-subtitle>

      <v-card-text class="resource-dialog__content">
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <v-textarea
          v-model="localPayload"
          class="resource-dialog__editor"
          auto-grow
          rows="12"
          spellcheck="false"
          variant="outlined"
          density="comfortable"
          :disabled="loading"
        />
      </v-card-text>

      <v-card-actions class="resource-dialog__actions">
        <v-spacer />
        <v-btn
          variant="text"
          color="primary"
          class="text-none"
          @click="emitClose(false)"
        >
          {{ t("admin.resume.platform.editor.cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :loading="loading"
          @click="handleSave"
        >
          {{ mode === "create" ? t("admin.resume.platform.editor.create") : t("admin.resume.platform.editor.update") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { PlatformResumeResourceName } from "~/lib/resume/platform-client";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  resource: PlatformResumeResourceName | null;
  mode: "create" | "edit";
  payload: string;
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", payload: string): void;
  (e: "close"): void;
}>();

const { t } = useI18n();

const localPayload = ref(props.payload);

watch(
  () => props.payload,
  (value) => {
    localPayload.value = value;
  },
);

const helperText = computed(() => {
  if (!props.resource) {
    return "";
  }

  return t("admin.resume.platform.editor.helper", {
    resource: t(`admin.resume.platform.resourceNames.${props.resource}`),
  });
});

function emitClose(value: boolean) {
  emit("update:modelValue", value);
  if (!value) {
    emit("close");
  }
}

function handleSave() {
  emit("save", localPayload.value);
}
</script>

<style scoped>
.resource-dialog {
  border: 1px solid rgba(59, 130, 246, 0.18);
  background: rgba(15, 23, 42, 0.96);
}

.resource-dialog__title {
  font-weight: 600;
  color: #f8fafc;
}

.resource-dialog__subtitle {
  color: rgba(148, 163, 184, 0.85);
}

.resource-dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-dialog__editor {
  font-family: "JetBrains Mono", "Fira Code", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
}

.resource-dialog__actions {
  padding-inline: 24px;
  padding-bottom: 20px;
}
</style>
