<template>
  <v-expansion-panel :value="resource">
    <v-expansion-panel-title class="resource-panel__title">
      <div>
        <div class="resource-panel__heading">{{ title }}</div>
        <div class="resource-panel__description">{{ description }}</div>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        class="text-none ml-auto"
        density="comfortable"
        size="small"
        @click.stop="emitCreate"
      >
        {{ t("admin.resume.platform.actions.add") }}
      </v-btn>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-alert
        v-if="!items.length"
        type="info"
        variant="tonal"
      >
        {{ emptyMessage }}
      </v-alert>

      <v-list
        v-else
        density="comfortable"
        class="resource-panel__list"
      >
        <v-list-item
          v-for="item in items"
          :key="item.id ?? summary(item)"
          class="resource-panel__item"
        >
          <template #prepend>
            <v-avatar
              size="32"
              color="primary"
            >
              <v-icon icon="mdi-file-document-edit" />
            </v-avatar>
          </template>
          <v-list-item-title class="resource-panel__item-title">
            {{ summary(item) }}
          </v-list-item-title>
          <v-list-item-subtitle class="resource-panel__item-subtitle">
            <code>{{ item.id }}</code>
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click.stop="emitUpdate(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click.stop="emitDelete(item)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { PlatformResumeResourceName } from "~/lib/resume/platform-client";

import { useI18n } from "vue-i18n";

const props = defineProps<{
  title: string;
  description: string;
  items: Array<Record<string, unknown>>;
  emptyMessage: string;
  resource: PlatformResumeResourceName;
}>();

const emit = defineEmits<{
  create: [PlatformResumeResourceName];
  update: [PlatformResumeResourceName, Record<string, unknown>];
  delete: [PlatformResumeResourceName, string];
}>();

const { t } = useI18n();

function emitCreate() {
  emit("create", props.resource);
}

function emitUpdate(item: Record<string, unknown>) {
  emit("update", props.resource, item);
}

function emitDelete(item: Record<string, unknown>) {
  const id = typeof item.id === "string" ? item.id : "";
  if (!id) {
    return;
  }

  emit("delete", props.resource, id);
}

function summary(item: Record<string, unknown>): string {
  const candidates = [
    "name",
    "title",
    "role",
    "company",
    "degree",
    "institution",
    "headline",
  ];

  for (const key of candidates) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  if (typeof item.description === "string" && item.description.trim()) {
    return item.description.slice(0, 60);
  }

  return t("admin.resume.platform.actions.untitled");
}
</script>

<style scoped>
.resource-panel__title {
  align-items: center;
  gap: 12px;
}

.resource-panel__heading {
  font-weight: 600;
  color: #f8fafc;
}

.resource-panel__description {
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.75);
}

.resource-panel__list {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.08);
}

.resource-panel__item-title {
  font-weight: 600;
  color: #f8fafc;
}

.resource-panel__item-subtitle {
  color: rgba(148, 163, 184, 0.9);
}
</style>
