<template>
  <v-card
    class="platform-resume"
    elevation="0"
    rounded="xl"
  >
    <v-card-text class="platform-resume__content">
      <div class="platform-resume__header">
        <div>
          <p class="platform-resume__eyebrow">{{ t("admin.resume.platform.eyebrow") }}</p>
          <h2 class="platform-resume__title">{{ t("admin.resume.platform.title") }}</h2>
          <p class="platform-resume__subtitle">{{ t("admin.resume.platform.subtitle") }}</p>
        </div>
        <div class="platform-resume__meta">
          <v-chip
            v-if="resumeStore.resume"
            color="primary"
            variant="tonal"
            class="text-none"
          >
            {{ t("admin.resume.platform.resumeId") }}
            <code class="platform-resume__code">{{ resumeStore.resume?.id }}</code>
          </v-chip>
          <v-btn
            color="primary"
            variant="tonal"
            class="text-none"
            :loading="resumeStore.isLoading"
            @click="handleReload"
          >
            {{ t("admin.resume.platform.reload") }}
          </v-btn>
        </div>
      </div>

      <v-alert
        v-if="resumeStore.error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ resumeStore.error }}
      </v-alert>

      <div
        v-if="resumeStore.isLoading && !resumeStore.isLoaded"
        class="platform-resume__loading"
      >
        <v-progress-circular
          color="primary"
          size="28"
          indeterminate
        />
        <span>{{ t("admin.resume.platform.loading") }}</span>
      </div>

      <template v-else>
        <v-expansion-panels
          multiple
          variant="accordion"
        >
          <ResourcePanel
            v-for="resource in resources"
            :key="resource.key"
            :title="resource.title"
            :description="resource.description"
            :items="resource.items"
            :empty-message="resource.empty"
            :resource="resource.key"
            @create="handleCreate"
            @update="handleUpdate"
            @delete="handleDelete"
          />
        </v-expansion-panels>
      </template>
    </v-card-text>

    <EditorDialog
      v-model="editor.open"
      :title="editor.title"
      :resource="editor.resource"
      :mode="editor.mode"
      :payload="editor.payload"
      :loading="editor.loading"
      :error="editor.error"
      @save="handleEditorSave"
      @close="resetEditor"
    />
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { usePlatformResumeStore } from "~/stores/platform-resume";
import type { PlatformResumeResourceName } from "~/lib/resume/platform-client";

import ResourcePanel from "~/components/admin/resume/ResourcePanel.vue";
import EditorDialog from "~/components/admin/resume/ResourceEditorDialog.vue";

const { t } = useI18n();
const resumeStore = usePlatformResumeStore();

try {
  await resumeStore.fetchResume();
} catch (error) {
  console.error("Failed to load platform resume", error);
}

interface EditorState {
  open: boolean;
  resource: PlatformResumeResourceName | null;
  mode: "create" | "edit";
  payload: string;
  title: string;
  id: string | null;
  loading: boolean;
  error: string | null;
}

const editor = reactive<EditorState>({
  open: false,
  resource: null,
  mode: "create",
  payload: "",
  title: "",
  id: null,
  loading: false,
  error: null,
});

const resources = computed(() => [
  {
    key: "experience" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.experiences.title"),
    description: t("admin.resume.platform.sections.experiences.description"),
    items: resumeStore.experiences,
    empty: t("admin.resume.platform.sections.experiences.empty"),
  },
  {
    key: "education" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.education.title"),
    description: t("admin.resume.platform.sections.education.description"),
    items: resumeStore.education,
    empty: t("admin.resume.platform.sections.education.empty"),
  },
  {
    key: "skill" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.skills.title"),
    description: t("admin.resume.platform.sections.skills.description"),
    items: resumeStore.skills,
    empty: t("admin.resume.platform.sections.skills.empty"),
  },
  {
    key: "language" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.languages.title"),
    description: t("admin.resume.platform.sections.languages.description"),
    items: resumeStore.languages,
    empty: t("admin.resume.platform.sections.languages.empty"),
  },
  {
    key: "hobby" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.hobbies.title"),
    description: t("admin.resume.platform.sections.hobbies.description"),
    items: resumeStore.hobbies,
    empty: t("admin.resume.platform.sections.hobbies.empty"),
  },
  {
    key: "project" as PlatformResumeResourceName,
    title: t("admin.resume.platform.sections.projects.title"),
    description: t("admin.resume.platform.sections.projects.description"),
    items: resumeStore.projects,
    empty: t("admin.resume.platform.sections.projects.empty"),
  },
]);

function openEditor(resource: PlatformResumeResourceName, mode: "create" | "edit", payload: Record<string, unknown>, id: string | null) {
  editor.resource = resource;
  editor.mode = mode;
  editor.payload = JSON.stringify(payload, null, 2);
  editor.title =
    mode === "create"
      ? t("admin.resume.platform.editor.createTitle", { resource: t(`admin.resume.platform.resourceNames.${resource}`) })
      : t("admin.resume.platform.editor.editTitle", { resource: t(`admin.resume.platform.resourceNames.${resource}`) });
  editor.id = id;
  editor.error = null;
  editor.open = true;
}

function handleCreate(resource: PlatformResumeResourceName) {
  const payload = resumeStore.buildDefaultPayload(resource);
  openEditor(resource, "create", payload, null);
}

function handleUpdate(resource: PlatformResumeResourceName, item: Record<string, unknown>) {
  openEditor(resource, "edit", item, (item.id as string) ?? null);
}

async function handleDelete(resource: PlatformResumeResourceName, id: string) {
  try {
    await resumeStore.deleteResource(resource, id);
  } catch (error) {
    console.error("Failed to delete entry", error);
  }
}

async function handleEditorSave(payload: string) {
  if (!editor.resource) {
    return;
  }

  try {
    editor.loading = true;
    editor.error = null;
    const parsed = JSON.parse(payload) as Record<string, unknown>;

    if (editor.mode === "create") {
      await resumeStore.createResource(editor.resource, parsed);
    } else if (editor.id) {
      await resumeStore.updateResource(editor.resource, editor.id, parsed);
    }

    resetEditor();
  } catch (error) {
    editor.error = error instanceof Error ? error.message : t("admin.resume.platform.editor.parseError");
  } finally {
    editor.loading = false;
  }
}

function resetEditor() {
  editor.open = false;
  editor.resource = null;
  editor.payload = "";
  editor.id = null;
  editor.error = null;
  editor.loading = false;
}

async function handleReload() {
  try {
    await resumeStore.reload();
  } catch (error) {
    console.error("Failed to reload resume", error);
  }
}

</script>

<style scoped>
.platform-resume {
  border: 1px solid rgba(59, 130, 246, 0.12);
  background: rgba(15, 23, 42, 0.92);
}

.platform-resume__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: clamp(22px, 3vw, 30px);
}

.platform-resume__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 18px;
}

.platform-resume__eyebrow {
  margin: 0 0 6px;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(191, 219, 254, 0.9);
}

.platform-resume__title {
  margin: 0;
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 600;
  color: #f8fafc;
}

.platform-resume__subtitle {
  margin: 8px 0 0;
  color: rgba(226, 232, 240, 0.85);
  font-size: 0.95rem;
  line-height: 1.6;
}

.platform-resume__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.platform-resume__code {
  margin-left: 8px;
  font-size: 0.8rem;
}

.platform-resume__loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 600px) {
  .platform-resume__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .platform-resume__meta {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
