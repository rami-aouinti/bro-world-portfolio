<template>
  <div class="trend-chart">
    <canvas
      ref="canvasRef"
      class="trend-chart__canvas"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { AnalyticsTimeseriesPoint } from "~/types/analytics";

const props = defineProps<{
  series: AnalyticsTimeseriesPoint[];
  range: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

let chart: any | null = null;

function formatLabel(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function ensureChart() {
  if (!canvasRef.value) {
    return;
  }

  const { default: Chart } = await import("https://esm.sh/chart.js@4.4.7?bundle");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(canvasRef.value, {
    type: "line",
    data: {
      labels: props.series.map((point) => formatLabel(point.timestamp)),
      datasets: [
        {
          label: "Page views",
          data: props.series.map((point) => point.pageViews),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.18)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: "Visitors",
          data: props.series.map((point) => point.visitors),
          borderColor: "#f472b6",
          backgroundColor: "rgba(244, 114, 182, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            color: "var(--v-theme-on-surface)",
          },
        },
        tooltip: {
          intersect: false,
          mode: "index",
        },
      },
      interaction: {
        intersect: false,
        mode: "nearest",
      },
      scales: {
        x: {
          grid: {
            color: "rgba(148, 163, 184, 0.25)",
          },
          ticks: {
            color: "var(--v-theme-on-surface-variant)",
            maxRotation: 0,
            autoSkip: true,
            autoSkipPadding: 16,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(148, 163, 184, 0.16)",
          },
          ticks: {
            color: "var(--v-theme-on-surface-variant)",
          },
        },
      },
    },
  });
}

onMounted(() => {
  if (import.meta.client) {
    ensureChart();
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
    chart = null;
  }
});

watch(
  () => [props.series, props.range],
  () => {
    if (!import.meta.client) {
      return;
    }
    ensureChart();
  },
  { deep: true },
);
</script>

<style scoped>
.trend-chart {
  position: relative;
  width: 100%;
  min-height: 240px;
}

.trend-chart__canvas {
  width: 100%;
  height: 100%;
}
</style>
