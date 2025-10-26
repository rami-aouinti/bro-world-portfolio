<template>
  <div
    ref="canvasContainerRef"
    :class="$props.class"
    aria-hidden="true"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, computed } from "vue";
import { useDevicePixelRatio, useResizeObserver } from "@vueuse/core";

type Snowflake = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  dx: number; // Horizontal drift
  dy: number; // Vertical fall speed
};

type Props = {
  color?: string;
  quantity?: number;
  speed?: number;
  maxRadius?: number;
  minRadius?: number;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  color: "#FFF",
  quantity: 100,
  speed: 1, // Controls how fast the snowflakes fall
  maxRadius: 3, // Default max radius
  minRadius: 1, // Default min radius
  class: "",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const snowflakes = ref<Snowflake[]>([]);
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { pixelRatio } = useDevicePixelRatio();

const color = computed(() => {
  const hex = props.color.replace(/^#/, "").padStart(6, "0");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
});

let resizeRaf: number | null = null;
let stopResizeObserver: (() => void) | undefined;

onMounted(() => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext("2d");
  }

  animate();
  scheduleResize();

  stopResizeObserver = useResizeObserver(canvasContainerRef, ([entry]) => {
    scheduleResize(entry.contentRect);
  });
});

onBeforeUnmount(() => {
  if (resizeRaf !== null) {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = null;
  }
  stopResizeObserver?.();
});

function scheduleResize(rect?: DOMRectReadOnly) {
  if (resizeRaf !== null) {
    cancelAnimationFrame(resizeRaf);
  }

  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null;
    resizeCanvas(rect);
  });
}

function resizeCanvas(rect?: DOMRectReadOnly) {
  if (!canvasContainerRef.value || !canvasRef.value || !context.value) {
    return;
  }

  const nextWidth = Math.round(rect?.width ?? canvasContainerRef.value.clientWidth);
  const nextHeight = Math.round(rect?.height ?? canvasContainerRef.value.clientHeight);

  if (nextWidth <= 0 || nextHeight <= 0) {
    return;
  }

  if (nextWidth === canvasSize.w && nextHeight === canvasSize.h) {
    return;
  }

  canvasSize.w = nextWidth;
  canvasSize.h = nextHeight;

  canvasRef.value.width = canvasSize.w * pixelRatio.value;
  canvasRef.value.height = canvasSize.h * pixelRatio.value;
  canvasRef.value.style.width = `${canvasSize.w}px`;
  canvasRef.value.style.height = `${canvasSize.h}px`;

  // Reset the transform before applying a new scale to avoid accumulating values.
  context.value.setTransform(1, 0, 0, 1, 0, 0);
  context.value.scale(pixelRatio.value, pixelRatio.value);

  regenerateSnowflakes();
}

function regenerateSnowflakes() {
  snowflakes.value.length = 0;
  createSnowflakes();
}

function createSnowflakes() {
  for (let i = 0; i < props.quantity; i++) {
    const snowflake = createSnowflake();
    snowflakes.value.push(snowflake);
  }
}

function createSnowflake(): Snowflake {
  const x = Math.random() * canvasSize.w;
  const y = Math.random() * canvasSize.h;
  const size = Math.random() * (props.maxRadius! - props.minRadius!) + props.minRadius!; // Random size between min and max radius
  const alpha = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1
  const dx = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
  const dy = Math.random() * 0.25 + props.speed; // Falling speed

  return { x, y, size, alpha, dx, dy };
}

function drawSnowflake(snowflake: Snowflake) {
  if (context.value) {
    const { x, y, size, alpha } = snowflake;
    context.value.beginPath();
    context.value.arc(x, y, size, 0, Math.PI * 2);
    context.value.fillStyle = `rgba(${color.value.split(" ").join(", ")}, ${alpha})`;
    context.value.fill();
  }
}

function animate() {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
  }

  snowflakes.value.forEach((snowflake) => {
    snowflake.x += snowflake.dx; // Drift horizontally
    snowflake.y += snowflake.dy; // Fall down

    // Reset snowflake when it moves out of the canvas
    if (snowflake.y > canvasSize.h) {
      snowflake.y = -snowflake.size; // Reset to the top
      snowflake.x = Math.random() * canvasSize.w; // Random horizontal position
    }

    drawSnowflake(snowflake);
  });

  requestAnimationFrame(animate);
}
</script>
