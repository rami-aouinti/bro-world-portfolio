<template>
  <section
    id="impact"
    class="impact"
  >
    <ScrollSmooth>
      <v-container class="impact__container">
        <div class="impact__header">
          <div>
            <p class="impact__eyebrow text-uppercase">{{ impactContent?.label }}</p>
            <h2 class="impact__headline">{{ impactContent?.headline }}</h2>
            <p class="impact__description">{{ impactContent?.subline }}</p>
          </div>
          <div class="impact__range">
            <span class="impact__range-label">{{ t('portfolio.impact.rangeLabel') }}</span>
            <div class="impact__range-buttons">
              <v-btn
                v-for="option in rangeOptions"
                :key="option.value"
                class="impact__range-button text-none"
                :color="range === option.value ? 'primary' : undefined"
                :variant="range === option.value ? 'flat' : 'text'"
                size="small"
                @click="setRange(option.value)"
              >
                {{ option.label }}
              </v-btn>
            </div>
            <p
              v-if="lastUpdated"
              class="impact__timestamp"
            >
              {{ t('portfolio.impact.updated', { value: lastUpdated }) }}
            </p>
          </div>
        </div>

        <div class="impact__grid">
          <article
            v-for="metric in resolvedMetrics"
            :key="metric.id"
            class="impact__metric"
          >
            <div class="impact__metric-head">
              <span class="impact__metric-label">{{ metric.label }}</span>
              <span
                class="impact__metric-change"
                :class="metric.changeClass"
              >
                <v-icon
                  v-if="metric.icon"
                  :icon="metric.icon"
                  size="16"
                  class="impact__metric-change-icon"
                />
                {{ metric.changeText }}
              </span>
            </div>
            <NumberFlow
              class="impact__metric-value"
              :value="metric.value"
              :play="!pending"
              :format="metric.format"
            />
            <span
              v-if="metric.unit"
              class="impact__metric-unit"
            >
              {{ metric.unit }}
            </span>
            <p class="impact__metric-description">
              {{ metric.description }}
            </p>
          </article>
        </div>

        <v-sheet
          color="transparent"
          class="impact__chart"
          rounded="xl"
          elevation="2"
        >
          <ClientOnly>
            <TrendChart
              :series="series"
              :range="range"
            />
            <template #fallback>
              <div class="impact__chart-fallback">{{ t('portfolio.impact.loadingChart') }}</div>
            </template>
          </ClientOnly>
        </v-sheet>

        <v-row class="impact__details" dense>
          <v-col cols="12" md="6">
            <v-card
              elevation="0"
              rounded="xl"
              class="impact__card"
            >
              <v-card-title class="impact__card-title">{{ t('portfolio.impact.topPagesTitle') }}</v-card-title>
              <v-divider class="impact__card-divider" />
              <v-list density="compact">
                <v-list-item
                  v-for="page in topPages"
                  :key="page.path"
                  class="impact__list-item"
                >
                  <v-list-item-title class="impact__list-path">{{ page.path }}</v-list-item-title>
                  <v-list-item-subtitle class="impact__list-meta">
                    {{ t('portfolio.impact.pageViews', { value: formatNumber(page.views) }) }} ·
                    {{ t('portfolio.impact.visitors', { value: formatNumber(page.visitors) }) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item
                  v-if="!topPages.length"
                  class="impact__list-item impact__list-item--empty"
                >
                  <v-list-item-title>{{ t('portfolio.impact.noPages') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card
              elevation="0"
              rounded="xl"
              class="impact__card"
            >
              <v-card-title class="impact__card-title">{{ t('portfolio.impact.performanceTitle') }}</v-card-title>
              <v-divider class="impact__card-divider" />
              <v-list density="compact">
                <v-list-item
                  v-for="metric in performance"
                  :key="metric.metric"
                  class="impact__list-item"
                >
                  <v-list-item-title class="impact__list-path">{{ metric.metric }}</v-list-item-title>
                  <v-list-item-subtitle class="impact__list-meta">
                    {{ t('portfolio.impact.metricP75', { value: metric.p75.toFixed(2) }) }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item
                  v-if="!performance.length"
                  class="impact__list-item impact__list-item--empty"
                >
                  <v-list-item-title>{{ t('portfolio.impact.noPerformance') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-if="activeMessage"
          type="info"
          variant="tonal"
          class="impact__message"
          rounded="lg"
        >
          <div class="impact__message-content">
            <h3 class="impact__message-headline">{{ activeMessage.headline }}</h3>
            <p class="impact__message-body">{{ activeMessage.body }}</p>
          </div>
        </v-alert>
      </v-container>
    </ScrollSmooth>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { NumberFlow } from "@number-flow/vue";
import ScrollSmooth from "~/components/layout/ScrollSmooth.vue";
import TrendChart from "~/components/analytics/TrendChart.vue";
import { useAnalytics } from "~/composables/useAnalytics";
import type { AnalyticsRange } from "~/types/analytics";

const { data: impact } = useContentBlock("impact");
const { t } = useI18n();
const route = useRoute();

const { range, setRange, totals, series, topPages, performance, pending, lastUpdated } = useAnalytics({ immediateRange: "7d" });

const clientReferrer = ref<string>("");

onMounted(() => {
  if (document.referrer) {
    clientReferrer.value = document.referrer;
  }
});

const impactContent = computed(() => impact.value);

const rangeOptions = computed(() => [
  { label: t("portfolio.impact.range24h"), value: "24h" as AnalyticsRange },
  { label: t("portfolio.impact.range7d"), value: "7d" as AnalyticsRange },
  { label: t("portfolio.impact.range30d"), value: "30d" as AnalyticsRange },
]);

const resolvedMetrics = computed(() => {
  const metrics = impactContent.value?.metrics ?? [];
  return metrics.map((metric, index) => {
    const total = metric.key ? totals.value[metric.key] : undefined;
    const value = total?.current ?? metric.placeholder;
    const change = total?.change ?? null;
    const changeText = change === null ? t("portfolio.impact.noChange") : `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    const changeClass = change === null ? "impact__metric-change--neutral" : change > 0 ? "impact__metric-change--positive" : "impact__metric-change--negative";
    const icon = change === null ? null : change > 0 ? "mdi-trending-up" : change < 0 ? "mdi-trending-down" : "mdi-minus";

    return {
      id: `${metric.key ?? index}`,
      label: metric.label,
      value,
      unit: metric.unit,
      description: metric.description,
      changeText,
      changeClass,
      icon,
      format: metric.key === "averageDuration" ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : { notation: "compact", maximumFractionDigits: 1 },
    };
  });
});

const activeMessage = computed(() => {
  const messages = impactContent.value?.messages ?? [];
  const utmSource = typeof route.query.utm_source === "string" ? route.query.utm_source.toLowerCase() : "";
  const normalizedReferrer = clientReferrer.value.toLowerCase();

  const matchKey = () => {
    if (utmSource) {
      return `referrer:${utmSource}`;
    }
    if (normalizedReferrer.includes("github")) {
      return "referrer:github";
    }
    if (normalizedReferrer.includes("linkedin")) {
      return "referrer:linkedin";
    }
    return "default";
  };

  const key = matchKey();
  return messages.find((message) => message.audience === key) ?? messages.find((message) => message.audience === "default") ?? null;
});

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
</script>

<style scoped>
.impact {
  position: relative;
  padding-block: 96px;
}

.impact__container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.impact__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
}

@media (min-width: 960px) {
  .impact__header {
    flex-direction: row;
    align-items: flex-start;
  }
}

.impact__eyebrow {
  letter-spacing: 0.08em;
  color: rgb(148 163 184);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.impact__headline {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  margin: 0;
}

.impact__description {
  margin: 12px 0 0;
  color: rgb(100 116 139);
  max-width: 520px;
}

.impact__range {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.impact__range-label {
  font-size: 0.85rem;
  color: rgb(148 163 184);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.impact__range-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.impact__timestamp {
  font-size: 0.85rem;
  color: rgb(100 116 139);
}

.impact__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.impact__metric {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(236, 72, 153, 0.12));
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.impact__metric::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(14, 165, 233, 0.18);
  pointer-events: none;
}

.impact__metric-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.impact__metric-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgb(15 23 42);
}

.impact__metric-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.impact__metric-change-icon {
  color: inherit;
}

.impact__metric-change--positive {
  color: rgb(22 163 74);
}

.impact__metric-change--negative {
  color: rgb(220 38 38);
}

.impact__metric-change--neutral {
  color: rgb(100 116 139);
}

.impact__metric-value {
  font-size: clamp(2.4rem, 5vw, 3.2rem);
  font-weight: 700;
  color: rgb(15 23 42);
}

.impact__metric-unit {
  font-size: 0.85rem;
  color: rgb(148 163 184);
  text-transform: uppercase;
}

.impact__metric-description {
  font-size: 0.9rem;
  color: rgb(71 85 105);
  margin: 0;
}

.impact__chart {
  padding: 24px;
}

.impact__chart-fallback {
  min-height: 200px;
  display: grid;
  place-items: center;
  color: rgb(148 163 184);
  font-size: 0.95rem;
}

.impact__details {
  margin-top: 8px;
  gap: 16px;
}

.impact__card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  backdrop-filter: blur(8px);
}

.impact__card-title {
  font-weight: 600;
}

.impact__card-divider {
  opacity: 0.6;
}

.impact__list-item {
  justify-content: space-between;
  padding-block: 8px;
}

.impact__list-item--empty {
  color: rgb(148 163 184);
  justify-content: center;
}

.impact__list-path {
  font-weight: 500;
}

.impact__list-meta {
  font-size: 0.85rem;
  color: rgb(148 163 184);
}

.impact__message {
  margin-top: 16px;
}

.impact__message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.impact__message-headline {
  margin: 0;
  font-weight: 600;
}

.impact__message-body {
  margin: 0;
  color: rgb(71 85 105);
}
</style>
