<template>
  <v-container class="hero-scene-editor mt-6">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="10"
        class="d-flex flex-column"
        style="gap: 24px"
      >
        <v-card
          elevation="0"
          class="hero-scene-card hero-scene-card--header"
        >
          <div class="hero-scene-card__inner">
            <div class="hero-scene-card__info">
              <v-btn
                :to="'/admin'"
                variant="text"
                color="primary"
                class="text-none px-0 hero-scene-card__back"
              >
                {{ t('admin.heroScene.actions.backToDashboard') }}
              </v-btn>
              <h1 class="hero-scene-card__title">
                {{ t('admin.heroScene.title') }}
              </h1>
              <p class="hero-scene-card__subtitle">
                {{ t('admin.heroScene.subtitle') }}
              </p>
            </div>
            <div class="hero-scene-card__controls">
              <v-select
                v-model="selectedLocale"
                :items="localeItems"
                item-title="title"
                item-value="value"
                :label="t('admin.heroScene.localeLabel')"
                density="comfortable"
                variant="outlined"
                hide-details
                class="hero-scene-card__locale"
              />
            </div>
          </div>
        </v-card>

        <v-card
          elevation="0"
          class="hero-scene-card"
        >
          <v-form
            class="hero-scene-form"
            @submit.prevent="handleSave"
          >
            <div
              v-if="pending"
              class="hero-scene-form__state"
            >
              <v-progress-circular
                color="primary"
                indeterminate
              />
              <p>{{ t('admin.heroScene.loading') }}</p>
            </div>
            <div
              v-else-if="error"
              class="hero-scene-form__state"
            >
              <v-icon
                color="error"
                icon="mdi-alert-circle-outline"
                size="40"
                class="mb-3"
              />
              <p>{{ t('admin.heroScene.error') }}</p>
            </div>
            <template v-else>
              <v-alert
                v-if="saveState.errors.length"
                type="error"
                variant="tonal"
                class="mb-6"
              >
                <ul class="hero-scene-form__errors">
                  <li
                    v-for="message in saveState.errors"
                    :key="message"
                  >
                    {{ message }}
                  </li>
                </ul>
              </v-alert>

              <v-alert
                v-if="saveState.success"
                type="success"
                variant="tonal"
                class="mb-6"
              >
                {{ saveState.success }}
              </v-alert>

              <div class="hero-scene-form__section">
                <div class="hero-scene-form__section-header">
                  <h2>{{ t('admin.heroScene.sections.sceneTitle') }}</h2>
                  <v-switch
                    v-model="sceneForm.enabled"
                    inset
                    color="primary"
                    :label="t('admin.heroScene.fields.enabled')"
                  />
                </div>

                <p class="hero-scene-form__hint">
                  {{ t('admin.heroScene.sections.sceneHint') }}
                </p>

                <v-row dense>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="sceneForm.primaryColor"
                      :label="t('admin.heroScene.fields.primaryColor')"
                      type="color"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="sceneForm.secondaryColor"
                      :label="t('admin.heroScene.fields.secondaryColor')"
                      type="color"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="sceneForm.accentColor"
                      :label="t('admin.heroScene.fields.accentColor')"
                      type="color"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-slider
                      v-model="sceneForm.particleDensity"
                      :label="t('admin.heroScene.fields.particleDensity')"
                      color="primary"
                      :min="0.1"
                      :max="2"
                      :step="0.05"
                      thumb-label
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-slider
                      v-model="sceneForm.bloomIntensity"
                      :label="t('admin.heroScene.fields.bloomIntensity')"
                      color="primary"
                      :min="0"
                      :max="2.5"
                      :step="0.05"
                      thumb-label
                    />
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-slider
                      v-model="sceneForm.rotationSpeed"
                      :label="t('admin.heroScene.fields.rotationSpeed')"
                      color="primary"
                      :min="-2"
                      :max="2"
                      :step="0.05"
                      thumb-label
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-slider
                      v-model="sceneForm.noiseStrength"
                      :label="t('admin.heroScene.fields.noiseStrength')"
                      color="primary"
                      :min="0"
                      :max="1.5"
                      :step="0.05"
                      thumb-label
                    />
                  </v-col>
                </v-row>
              </div>

              <div class="hero-scene-form__actions">
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="text-none"
                  prepend-icon="mdi-backup-restore"
                  @click="resetScene"
                >
                  {{ t('admin.heroScene.actions.reset') }}
                </v-btn>
                <v-btn
                  color="primary"
                  class="text-none"
                  type="submit"
                  :loading="saveState.isSaving"
                >
                  {{ t('admin.heroScene.actions.save') }}
                </v-btn>
              </div>
            </template>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { ZodError } from "zod";
import { heroSchema, HERO_SCENE_DEFAULTS, type HeroSceneSettings, type ContentRecord } from "~/types/content";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "~/utils/i18n/locales";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const localeItems = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    value: code,
    title: t(`admin.editor.localeNames.${code}`),
  })),
);

const selectedLocale = ref<LocaleCode>(DEFAULT_LOCALE);

const { data, pending, refresh, error } = await useAsyncData(
  () => `admin-hero-${selectedLocale.value}`,
  () => $fetch<ContentRecord["hero"]>("/api/content/hero", { query: { locale: selectedLocale.value } }),
  { watch: [selectedLocale] },
);

const sceneForm = reactive<HeroSceneSettings>({ ...HERO_SCENE_DEFAULTS });

const saveState = reactive({
  isSaving: false,
  success: "",
  errors: [] as string[],
});

watch(
  data,
  (value) => {
    saveState.success = "";
    saveState.errors = [];
    const nextScene: HeroSceneSettings = {
      ...HERO_SCENE_DEFAULTS,
      ...(value?.scene ?? {}),
    };
    Object.assign(sceneForm, nextScene);
  },
  { immediate: true },
);

const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName);

function resetScene() {
  Object.assign(sceneForm, { ...HERO_SCENE_DEFAULTS });
}

function parseErrorMessages(err: unknown) {
  if (err instanceof ZodError) {
    return err.errors.map((issue) => issue.message);
  }

  if (typeof err === "object" && err !== null && "data" in err && typeof (err as { data?: unknown }).data === "object") {
    const statusMessage = (err as { data?: { statusMessage?: string } }).data?.statusMessage;
    if (typeof statusMessage === "string" && statusMessage.length) {
      return [statusMessage];
    }
  }

  return [t("admin.heroScene.feedback.failure")];
}

async function handleSave() {
  if (!data.value) {
    saveState.errors = [t("admin.heroScene.feedback.missingContent")];
    return;
  }

  saveState.isSaving = true;
  saveState.success = "";
  saveState.errors = [];

  try {
    const payload = heroSchema.parse({
      ...data.value,
      scene: { ...sceneForm },
    });

    await $fetch(`/api/content/hero`, {
      method: "PUT",
      body: payload,
      query: { locale: selectedLocale.value },
      headers: {
        "x-csrf-token": csrfCookie.value ?? "",
      },
    });

    saveState.success = t("admin.heroScene.feedback.success");
    await refresh();
  } catch (err) {
    saveState.errors = parseErrorMessages(err);
  } finally {
    saveState.isSaving = false;
  }
}
</script>

<style scoped>
.hero-scene-card {
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(22px);
  color: rgba(226, 232, 240, 0.95);
}

.hero-scene-card--header {
  padding: 24px 32px;
}

.hero-scene-card__inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-scene-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-scene-card__title {
  font-size: clamp(1.4rem, 1.2rem + 1vw, 2.1rem);
  font-weight: 700;
  margin: 0;
}

.hero-scene-card__subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.75);
}

.hero-scene-card__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-scene-card__locale {
  max-width: 220px;
}

.hero-scene-form {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-scene-form__state {
  min-height: 200px;
  display: grid;
  place-items: center;
  gap: 16px;
  text-align: center;
  color: rgba(226, 232, 240, 0.8);
}

.hero-scene-form__section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-scene-form__section-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.hero-scene-form__section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.hero-scene-form__hint {
  margin: 0;
  color: rgba(226, 232, 240, 0.72);
}

.hero-scene-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.hero-scene-form__errors {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 4px;
}

@media (max-width: 960px) {
  .hero-scene-card--header {
    padding: 24px;
  }

  .hero-scene-card__controls {
    justify-content: flex-start;
  }

  .hero-scene-form {
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .hero-scene-form__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
