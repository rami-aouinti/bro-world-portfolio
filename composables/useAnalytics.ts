import { computed, ref } from "vue";
import { useFetch } from "#app";
import { formatDistanceToNowStrict } from "date-fns";
import { analyticsLiveResponseSchema, type AnalyticsLiveResponse, type AnalyticsRange } from "~/types/analytics";

type MetricTotals = Record<string, { current: number; previous: number | null; change: number | null }>;

type UseAnalyticsOptions = {
  immediateRange?: AnalyticsRange;
};

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const range = ref<AnalyticsRange>(options.immediateRange ?? "7d");

  const query = computed(() => ({ range: range.value }));

  const { data, pending, error, refresh } = useFetch("/api/analytics/live", {
    query,
    server: false,
    transform: (response) => analyticsLiveResponseSchema.parse(response),
    default: () => undefined,
    watch: [range],
  });

  const snapshot = computed<AnalyticsLiveResponse | null>(() => data.value ?? null);

  const totals = computed<MetricTotals>(() => {
    const value = snapshot.value;
    if (!value) {
      return {};
    }
    return {
      visitors: value.totals.visitors,
      pageViews: value.totals.pageViews,
      averageDuration: value.totals.averageDuration,
    } satisfies MetricTotals;
  });

  const lastUpdated = computed(() => {
    const value = snapshot.value?.generatedAt;
    if (!value) {
      return null;
    }
    try {
      return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
    } catch {
      return null;
    }
  });

  const series = computed(() => snapshot.value?.series ?? []);
  const topPages = computed(() => snapshot.value?.topPages ?? []);
  const performance = computed(() => snapshot.value?.performance ?? []);

  function setRange(nextRange: AnalyticsRange) {
    if (range.value === nextRange) {
      return;
    }
    range.value = nextRange;
  }

  return {
    range,
    pending,
    error,
    snapshot,
    totals,
    series,
    topPages,
    performance,
    lastUpdated,
    setRange,
    refresh,
  };
}
