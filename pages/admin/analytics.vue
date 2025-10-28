<template>
  <v-container class="admin-analytics mt-6">
    <v-row justify="center">
      <v-col cols="12" lg="10" class="d-flex flex-column" style="gap: 24px">
        <v-card elevation="0" rounded="xl" class="analytics-hero">
          <div class="analytics-hero__glow" />
          <v-card-text class="analytics-hero__content">
            <div class="analytics-hero__text">
              <p class="analytics-hero__eyebrow">{{ t('admin.analytics.eyebrow') }}</p>
              <h1 class="analytics-hero__title">{{ t('admin.analytics.title') }}</h1>
              <p class="analytics-hero__subtitle">{{ t('admin.analytics.subtitle') }}</p>
              <div class="analytics-hero__range">
                <span class="analytics-hero__range-label">{{ t('admin.analytics.rangeLabel') }}</span>
                <div class="analytics-hero__range-buttons">
                  <v-btn
                    v-for="option in rangeOptions"
                    :key="option.value"
                    class="text-none"
                    size="small"
                    :variant="range === option.value ? 'flat' : 'text'"
                    :color="range === option.value ? 'primary' : undefined"
                    @click="setRange(option.value)"
                  >
                    {{ option.label }}
                  </v-btn>
                </div>
                <p v-if="lastUpdated" class="analytics-hero__updated">
                  {{ t('admin.analytics.updated', { value: lastUpdated }) }}
                </p>
              </div>
            </div>
            <div class="analytics-hero__stats">
              <div v-for="metric in metricsSummary" :key="metric.key" class="analytics-stat">
                <span class="analytics-stat__label">{{ metric.label }}</span>
                <NumberFlow
                  class="analytics-stat__value"
                  :value="metric.value"
                  :play="!pending"
                  :format="metric.format"
                />
                <span class="analytics-stat__change" :class="metric.changeClass">{{ metric.changeText }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-sheet color="transparent" rounded="xl" class="analytics-chart" elevation="2">
          <ClientOnly>
            <TrendChart :series="series" :range="range" />
            <template #fallback>
              <div class="analytics-chart__fallback">{{ t('admin.analytics.loadingChart') }}</div>
            </template>
          </ClientOnly>
        </v-sheet>

        <v-row class="analytics-panels" dense>
          <v-col cols="12" md="6">
            <v-card elevation="0" rounded="xl" class="analytics-panel">
              <v-card-title class="analytics-panel__title">{{ t('admin.analytics.topPagesTitle') }}</v-card-title>
              <v-divider class="analytics-panel__divider" />
              <v-list density="comfortable">
                <v-list-item v-for="page in topPages" :key="page.path" class="analytics-panel__item">
                  <v-list-item-title>{{ page.path }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ t('admin.analytics.pageViews', { value: formatNumber(page.views) }) }} ·
                    {{ t('admin.analytics.visitors', { value: formatNumber(page.visitors) }) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="!topPages.length" class="analytics-panel__item analytics-panel__item--empty">
                  <v-list-item-title>{{ t('admin.analytics.noPages') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card elevation="0" rounded="xl" class="analytics-panel">
              <v-card-title class="analytics-panel__title">{{ t('admin.analytics.performanceTitle') }}</v-card-title>
              <v-divider class="analytics-panel__divider" />
              <v-list density="comfortable">
                <v-list-item v-for="metric in performance" :key="metric.metric" class="analytics-panel__item">
                  <v-list-item-title>{{ metric.metric }}</v-list-item-title>
                  <v-list-item-subtitle>{{ t('admin.analytics.metricP75', { value: metric.p75.toFixed(2) }) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="!performance.length" class="analytics-panel__item analytics-panel__item--empty">
                  <v-list-item-title>{{ t('admin.analytics.noPerformance') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <v-card elevation="0" rounded="xl" class="analytics-form" :loading="contentPending">
          <v-card-title class="d-flex flex-wrap justify-space-between align-center" style="gap: 16px">
            <div>
              <h2 class="analytics-form__title">{{ t('admin.analytics.formTitle') }}</h2>
              <p class="analytics-form__subtitle">{{ t('admin.analytics.formSubtitle') }}</p>
            </div>
            <v-select
              v-model="selectedLocale"
              :items="localeItems"
              item-title="title"
              item-value="value"
              density="comfortable"
              variant="outlined"
              class="analytics-form__locale"
              hide-details
            />
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-alert v-if="saveState.errors.length" type="error" variant="tonal" class="mb-4">
              <p class="font-weight-medium mb-2">{{ t('admin.analytics.validationTitle') }}</p>
              <ul class="analytics-form__errors">
                <li v-for="errorMessage in saveState.errors" :key="errorMessage">{{ errorMessage }}</li>
              </ul>
            </v-alert>
            <v-alert v-if="saveState.success" type="success" variant="tonal" class="mb-4">
              {{ saveState.success }}
            </v-alert>

            <v-form @submit.prevent="handleSave" class="analytics-form__grid">
              <v-text-field
                v-model="form.headline"
                :label="t('admin.analytics.fields.headline')"
                density="comfortable"
                variant="outlined"
                required
              />
              <v-textarea
                v-model="form.subline"
                :label="t('admin.analytics.fields.subline')"
                density="comfortable"
                variant="outlined"
                rows="3"
                auto-grow
                required
              />

              <section class="analytics-form__section">
                <header class="analytics-form__section-header">
                  <div>
                    <h3>{{ t('admin.analytics.metricsHeading') }}</h3>
                    <p>{{ t('admin.analytics.metricsDescription') }}</p>
                  </div>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    class="text-none"
                    size="small"
                    prepend-icon="mdi-plus"
                    @click="addMetric"
                  >
                    {{ t('admin.analytics.addMetric') }}
                  </v-btn>
                </header>
                <v-expansion-panels multiple class="analytics-form__panels">
                  <v-expansion-panel v-for="(metric, index) in form.metrics" :key="index" elevation="0" rounded="lg">
                    <v-expansion-panel-title>
                      <div class="analytics-form__panel-title">
                        <span>{{ metric.label || t('admin.analytics.metricPlaceholder', { index: index + 1 }) }}</span>
                        <v-chip size="x-small" color="primary" variant="tonal" v-if="metric.key">{{ metric.key }}</v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="metric.key"
                            :items="metricKeyOptions"
                            item-title="label"
                            item-value="value"
                            :label="t('admin.analytics.fields.metricKey')"
                            density="comfortable"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="metric.label"
                            :label="t('admin.analytics.fields.metricLabel')"
                            density="comfortable"
                            variant="outlined"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="metric.placeholder"
                            type="number"
                            :label="t('admin.analytics.fields.metricPlaceholder')"
                            density="comfortable"
                            variant="outlined"
                            min="0"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="metric.unit"
                            :label="t('admin.analytics.fields.metricUnit')"
                            density="comfortable"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="metric.description"
                            :label="t('admin.analytics.fields.metricDescription')"
                            density="comfortable"
                            variant="outlined"
                            auto-grow
                          />
                        </v-col>
                      </v-row>
                      <div class="analytics-form__panel-footer">
                        <v-btn
                          color="error"
                          variant="text"
                          class="text-none"
                          prepend-icon="mdi-delete-outline"
                          @click="removeMetric(index)"
                        >
                          {{ t('admin.analytics.removeMetric') }}
                        </v-btn>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <div v-if="!form.metrics.length" class="analytics-form__empty">{{ t('admin.analytics.noMetrics') }}</div>
                </v-expansion-panels>
              </section>

              <section class="analytics-form__section">
                <header class="analytics-form__section-header">
                  <div>
                    <h3>{{ t('admin.analytics.messagesHeading') }}</h3>
                    <p>{{ t('admin.analytics.messagesDescription') }}</p>
                  </div>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    class="text-none"
                    size="small"
                    prepend-icon="mdi-plus"
                    @click="addMessage"
                  >
                    {{ t('admin.analytics.addMessage') }}
                  </v-btn>
                </header>
                <v-expansion-panels multiple class="analytics-form__panels">
                  <v-expansion-panel v-for="(message, index) in form.messages" :key="index" elevation="0" rounded="lg">
                    <v-expansion-panel-title>
                      <div class="analytics-form__panel-title">
                        <span>{{ message.headline || t('admin.analytics.messagePlaceholder', { index: index + 1 }) }}</span>
                        <v-chip size="x-small" color="secondary" variant="tonal">{{ message.audience || '—' }}</v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="message.audience"
                            :label="t('admin.analytics.fields.audience')"
                            density="comfortable"
                            variant="outlined"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="message.headline"
                            :label="t('admin.analytics.fields.messageHeadline')"
                            density="comfortable"
                            variant="outlined"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="message.body"
                            :label="t('admin.analytics.fields.messageBody')"
                            density="comfortable"
                            variant="outlined"
                            auto-grow
                            required
                          />
                        </v-col>
                      </v-row>
                      <div class="analytics-form__panel-footer">
                        <v-btn
                          color="error"
                          variant="text"
                          class="text-none"
                          prepend-icon="mdi-delete-outline"
                          @click="removeMessage(index)"
                        >
                          {{ t('admin.analytics.removeMessage') }}
                        </v-btn>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <div v-if="!form.messages.length" class="analytics-form__empty">{{ t('admin.analytics.noMessages') }}</div>
                </v-expansion-panels>
              </section>

              <div class="analytics-form__actions">
                <v-btn
                  type="submit"
                  color="primary"
                  class="text-none"
                  :loading="saveState.isSaving"
                  prepend-icon="mdi-content-save"
                >
                  {{ t('admin.analytics.saveCta') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import NumberFlow from "@number-flow/vue";
import { ZodError } from "zod";
import TrendChart from "~/components/analytics/TrendChart.vue";
import { useAnalytics } from "~/composables/useAnalytics";
import { impactSchema } from "~/types/content";
import type { AnalyticsRange } from "~/types/analytics";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, resolveLocale, type LocaleCode } from "~/utils/i18n/locales";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const { t, locale } = useI18n();
const runtimeConfig = useRuntimeConfig();
const csrfCookie = useCookie<string | null>(runtimeConfig.public.auth.csrfCookieName);

const selectedLocale = ref<LocaleCode>(resolveLocale(locale.value));

const { range, setRange, snapshot, totals, series, topPages, performance, lastUpdated, pending } = useAnalytics({ immediateRange: "7d" });

const rangeOptions = computed(() => [
  { value: "24h" as AnalyticsRange, label: t("admin.analytics.range24h") },
  { value: "7d" as AnalyticsRange, label: t("admin.analytics.range7d") },
  { value: "30d" as AnalyticsRange, label: t("admin.analytics.range30d") },
]);

const metricKeyOptions = computed(() => [
  { value: "visitors", label: t("admin.analytics.metricKeys.visitors") },
  { value: "pageViews", label: t("admin.analytics.metricKeys.pageViews") },
  { value: "averageDuration", label: t("admin.analytics.metricKeys.averageDuration") },
]);

const { data: impactContent, pending: contentPending, refresh: refreshImpact } = await useAsyncData(
  () => `admin-impact-${selectedLocale.value}`,
  () =>
    $fetch("/api/content/impact", {
      query: { locale: selectedLocale.value },
    }),
  { watch: [selectedLocale] },
);

const localeItems = computed(() =>
  SUPPORTED_LOCALES.map((code) => ({
    value: code,
    title: t(`admin.editor.localeNames.${code}`),
  })),
);

const form = reactive({
  headline: "",
  subline: "",
  metrics: [] as Array<{ key?: string; label: string; description?: string; placeholder: number; unit?: string }>,
  messages: [] as Array<{ audience: string; headline: string; body: string }>,
});

const saveState = reactive({
  isSaving: false,
  success: "",
  errors: [] as string[],
});

watch(
  impactContent,
  (value) => {
    if (!value) {
      return;
    }
    saveState.success = "";
    saveState.errors = [];
    const clone = JSON.parse(JSON.stringify(value));
    form.headline = clone.headline ?? "";
    form.subline = clone.subline ?? "";
    form.metrics = clone.metrics?.map((metric) => ({ ...metric })) ?? [];
    form.messages = clone.messages?.map((message) => ({ ...message })) ?? [];
  },
  { immediate: true },
);

const metricsSummary = computed(() => {
  const value = totals.value;
  return [
    {
      key: "visitors",
      label: t("admin.analytics.metricKeys.visitors"),
      value: value.visitors?.current ?? 0,
      changeText: formatChange(value.visitors?.change),
      changeClass: resolveChangeClass(value.visitors?.change),
      format: { notation: "compact", maximumFractionDigits: 1 } as Intl.NumberFormatOptions,
    },
    {
      key: "pageViews",
      label: t("admin.analytics.metricKeys.pageViews"),
      value: value.pageViews?.current ?? 0,
      changeText: formatChange(value.pageViews?.change),
      changeClass: resolveChangeClass(value.pageViews?.change),
      format: { notation: "compact", maximumFractionDigits: 1 } as Intl.NumberFormatOptions,
    },
    {
      key: "averageDuration",
      label: t("admin.analytics.metricKeys.averageDuration"),
      value: value.averageDuration?.current ?? 0,
      changeText: formatChange(value.averageDuration?.change),
      changeClass: resolveChangeClass(value.averageDuration?.change),
      format: { maximumFractionDigits: 0 } as Intl.NumberFormatOptions,
    },
  ];
});

function formatChange(change: number | null | undefined) {
  if (change === null || change === undefined) {
    return t("admin.analytics.noChange");
  }
  const prefix = change > 0 ? "+" : "";
  return `${prefix}${change.toFixed(2)}%`;
}

function resolveChangeClass(change: number | null | undefined) {
  if (change === null || change === undefined) {
    return "analytics-stat__change--neutral";
  }
  if (change > 0) {
    return "analytics-stat__change--positive";
  }
  if (change < 0) {
    return "analytics-stat__change--negative";
  }
  return "analytics-stat__change--neutral";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function addMetric() {
  form.metrics.push({ key: undefined, label: "", description: "", placeholder: 0, unit: "" });
}

function removeMetric(index: number) {
  form.metrics.splice(index, 1);
}

function addMessage() {
  form.messages.push({ audience: "", headline: "", body: "" });
}

function removeMessage(index: number) {
  form.messages.splice(index, 1);
}

function isFetchError(value: unknown): value is { data?: { statusMessage?: string } } {
  return Boolean(value && typeof value === "object" && "data" in value);
}

async function handleSave() {
  saveState.isSaving = true;
  saveState.success = "";
  saveState.errors = [];

  try {
    const payload = impactSchema.parse({
      label: impactContent.value?.label ?? "",
      headline: form.headline,
      subline: form.subline,
      metrics: form.metrics.map((metric) => ({
        key: metric.key,
        label: metric.label,
        description: metric.description ?? "",
        placeholder: Number(metric.placeholder) || 0,
        unit: metric.unit ?? "",
      })),
      messages: form.messages.map((message) => ({
        audience: message.audience,
        headline: message.headline,
        body: message.body,
      })),
    });

    await $fetch("/api/content/impact", {
      method: "PUT",
      body: payload,
      query: { locale: selectedLocale.value },
      headers: {
        "x-csrf-token": csrfCookie.value ?? "",
      },
    });

    saveState.success = t("admin.analytics.saveSuccess");
    await refreshImpact();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      saveState.errors = error.errors.map((issue) => issue.message);
    } else if (isFetchError(error) && typeof error.data?.statusMessage === "string") {
      saveState.errors = [error.data.statusMessage];
    } else {
      saveState.errors = [t("admin.analytics.saveFailure")];
    }
  } finally {
    saveState.isSaving = false;
  }
}
</script>

<style scoped>
.admin-analytics {
  padding-bottom: 64px;
}

.analytics-hero {
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  background: radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.18), transparent 60%),
    radial-gradient(circle at 80% 10%, rgba(236, 72, 153, 0.2), transparent 60%),
    rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.analytics-hero__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(236, 72, 153, 0.12));
  opacity: 0.9;
}

.analytics-hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: clamp(24px, 6vw, 48px);
}

@media (min-width: 1024px) {
  .analytics-hero__content {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.analytics-hero__text {
  max-width: 540px;
  color: white;
}

.analytics-hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  opacity: 0.8;
}

.analytics-hero__title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin: 8px 0;
}

.analytics-hero__subtitle {
  margin: 0;
  opacity: 0.85;
}

.analytics-hero__range {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analytics-hero__range-label {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.analytics-hero__range-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.analytics-hero__updated {
  font-size: 0.85rem;
  opacity: 0.75;
}

.analytics-hero__stats {
  display: grid;
  gap: 16px;
  width: min(100%, 320px);
}

.analytics-stat {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: white;
}

.analytics-stat__label {
  font-size: 0.95rem;
  opacity: 0.7;
}

.analytics-stat__value {
  font-size: 2.4rem;
  font-weight: 700;
}

.analytics-stat__change {
  font-size: 0.9rem;
  font-weight: 600;
}

.analytics-stat__change--positive {
  color: #4ade80;
}

.analytics-stat__change--negative {
  color: #f87171;
}

.analytics-stat__change--neutral {
  color: rgba(255, 255, 255, 0.6);
}

.analytics-chart {
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(16px);
}

.analytics-chart__fallback {
  min-height: 220px;
  display: grid;
  place-items: center;
  color: rgb(148, 163, 184);
}

.analytics-panels {
  gap: 16px;
}

.analytics-panel {
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.72);
  color: white;
  backdrop-filter: blur(12px);
}

.analytics-panel__title {
  font-weight: 600;
}

.analytics-panel__divider {
  opacity: 0.5;
}

.analytics-panel__item--empty {
  justify-content: center;
  color: rgba(226, 232, 240, 0.7);
}

.analytics-form {
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.85);
  color: white;
}

.analytics-form__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.analytics-form__subtitle {
  margin: 4px 0 0;
  opacity: 0.75;
}

.analytics-form__locale {
  min-width: 200px;
}

.analytics-form__grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analytics-form__section {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analytics-form__section-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.analytics-form__section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.analytics-form__section-header p {
  margin: 4px 0 0;
  opacity: 0.75;
  max-width: 480px;
}

.analytics-form__panels {
  background: transparent;
}

.analytics-form__panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.analytics-form__panel-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.analytics-form__empty {
  padding: 16px;
  text-align: center;
  color: rgba(226, 232, 240, 0.7);
}

.analytics-form__actions {
  display: flex;
  justify-content: flex-end;
}

.analytics-form__errors {
  margin: 0;
  padding-left: 20px;
}
</style>
