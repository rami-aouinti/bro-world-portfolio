<template>
  <div
    ref="ctnDom"
    :class="cn('block size-full', props?.class)"
  ></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, type HTMLAttributes } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { Renderer, Program, Mesh, Color, Triangle, type OGLRenderingContext } from "ogl";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const ctnDom = ref<HTMLDivElement | null>(null);

let animateId: number;
let renderer: Renderer;
let gl: OGLRenderingContext;
let mesh: Mesh;
let resizeRaf: number | null = null;
let stopResizeObserver: (() => void) | undefined;

// Vertex Shader
const vert = `
  attribute vec2 uv;
  attribute vec2 position;
  
  varying vec2 vUv;
  
  void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
  }
  `;

// Fragment Shader
const frag = `
  precision highp float;
  
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uResolution;
  
  varying vec2 vUv;
  
  void main() {
      float mr = min(uResolution.x, uResolution.y);
      vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  
      float d = -uTime * 1.2;
      float a = 0.0;
      for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
      }
      d += uTime * 1.0;
      vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
      col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
      gl_FragColor = vec4(col, 1.0);
  }
  `;

function scheduleResize(rect?: DOMRectReadOnly) {
  if (resizeRaf !== null) {
    cancelAnimationFrame(resizeRaf);
  }

  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null;
    resize(rect);
  });
}

function resize(rect?: DOMRectReadOnly) {
  if (!ctnDom.value) return;
  const scale = 1;
  const width = Math.round(rect?.width ?? ctnDom.value.clientWidth);
  const height = Math.round(rect?.height ?? ctnDom.value.clientHeight);

  if (width <= 0 || height <= 0) return;

  renderer.setSize(width * scale, height * scale);
  if (mesh) {
    mesh.program.uniforms.uResolution.value = [
      gl.canvas.width,
      gl.canvas.height,
      gl.canvas.width / gl.canvas.height,
    ];
  }
}

function update(t: number) {
  animateId = requestAnimationFrame(update);
  if (mesh) {
    mesh.program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
  }
}

onMounted(() => {
  if (!ctnDom.value) return;

  renderer = new Renderer();
  gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  scheduleResize();

  stopResizeObserver = useResizeObserver(ctnDom, ([entry]) => {
    scheduleResize(entry.contentRect);
  });

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
      uResolution: {
        value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height],
      },
    },
  });

  mesh = new Mesh(gl, { geometry, program });
  animateId = requestAnimationFrame(update);

  ctnDom.value.appendChild(gl.canvas);
});

onUnmounted(() => {
  cancelAnimationFrame(animateId);
  if (resizeRaf !== null) {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = null;
  }
  stopResizeObserver?.();
  if (ctnDom.value && gl?.canvas) {
    ctnDom.value.removeChild(gl.canvas);
  }
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
});
</script>
