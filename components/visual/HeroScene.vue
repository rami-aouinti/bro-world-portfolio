<template>
  <div
    ref="rootRef"
    class="hero-scene"
    :data-state="sceneState"
    :style="backgroundStyle"
  >
    <canvas
      v-if="sceneState === 'ready'"
      ref="canvasRef"
      class="hero-scene__canvas"
    />
    <div
      v-else
      class="hero-scene__fallback"
    >
      <slot name="fallback">
        <div class="hero-scene__gradient" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { useEventListener, useRafFn } from "@vueuse/core";
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import * as THREE from "three";

export interface HeroSceneProps {
  enabled: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  particleDensity: number;
  bloomIntensity: number;
  rotationSpeed: number;
  noiseStrength: number;
}

const props = withDefaults(defineProps<HeroSceneProps>(), {
  enabled: true,
  primaryColor: "#0ea5e9",
  secondaryColor: "#22d3ee",
  accentColor: "#f472b6",
  particleDensity: 0.65,
  bloomIntensity: 0.45,
  rotationSpeed: 0.18,
  noiseStrength: 0.35,
});

const rootRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const renderer = shallowRef<THREE.WebGLRenderer | null>(null);
const scene = shallowRef<THREE.Scene | null>(null);
const camera = shallowRef<THREE.PerspectiveCamera | null>(null);
const composer = shallowRef<EffectComposer | null>(null);
const light = shallowRef<THREE.PointLight | null>(null);
const ambientLight = shallowRef<THREE.AmbientLight | null>(null);
const points = shallowRef<THREE.Points | null>(null);
const particleOffsets = shallowRef<Float32Array | null>(null);
const basePositions = shallowRef<Float32Array | null>(null);

const clock = new THREE.Clock();

const isClient = computed(() => import.meta.client);

const canRenderWebGL = computed(() => {
  if (!isClient.value || !props.enabled) {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    return context !== null;
  } catch {
    return false;
  }
});

const sceneState = computed(() => (canRenderWebGL.value && renderer.value ? "ready" : "fallback"));

const backgroundStyle = computed(() => ({
  "--hero-scene-primary": props.primaryColor,
  "--hero-scene-secondary": props.secondaryColor,
  "--hero-scene-accent": props.accentColor,
}));

function disposeScene() {
  if (composer.value) {
    for (const pass of composer.value.passes) {
      if (typeof (pass as { dispose?: () => void }).dispose === "function") {
        (pass as { dispose?: () => void }).dispose?.();
      }
    }
    composer.value.dispose?.();
    composer.value = null;
  }

  if (renderer.value) {
    renderer.value.dispose();
    renderer.value.forceContextLoss();
    renderer.value.domElement.remove();
    renderer.value = null;
  }

  if (scene.value) {
    if (points.value) {
      scene.value.remove(points.value);
      points.value.geometry?.dispose();
      (points.value.material as THREE.Material | undefined)?.dispose?.();
      points.value = null;
    }

    if (light.value) {
      scene.value.remove(light.value);
      light.value = null;
    }

    if (ambientLight.value) {
      scene.value.remove(ambientLight.value);
      ambientLight.value = null;
    }

    scene.value.clear();
    scene.value = null;
  }

  camera.value = null;
  particleOffsets.value = null;
  basePositions.value = null;
}

function createParticleGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const offsets = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const i3 = index * 3;
    const radius = THREE.MathUtils.randFloat(0.4, 1.25);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    offsets[index] = THREE.MathUtils.randFloat(0, Math.PI * 2);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleOffsets.value = offsets;
  basePositions.value = positions.slice();

  return geometry;
}

function buildParticleMaterial() {
  return new THREE.PointsMaterial({
    size: 0.045,
    transparent: true,
    opacity: 0.9,
    color: new THREE.Color(props.primaryColor),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function rebuildParticles() {
  if (!scene.value) {
    return;
  }

  if (points.value) {
    scene.value.remove(points.value);
    points.value.geometry?.dispose();
    (points.value.material as THREE.Material | undefined)?.dispose?.();
  }

  const density = THREE.MathUtils.clamp(props.particleDensity, 0.1, 1.5);
  const count = Math.floor(1200 + density * 1600);
  const geometry = createParticleGeometry(count);
  const material = buildParticleMaterial();

  const particleCloud = new THREE.Points(geometry, material);
  particleCloud.frustumCulled = false;
  scene.value.add(particleCloud);
  points.value = particleCloud;
}

function updateLighting() {
  if (!light.value || !ambientLight.value) {
    return;
  }

  light.value.color = new THREE.Color(props.accentColor);
  ambientLight.value.color = new THREE.Color(props.secondaryColor);
}

function updateBloomIntensity() {
  const composerInstance = composer.value;
  if (!composerInstance) {
    return;
  }

  for (const pass of composerInstance.passes) {
    if (pass instanceof EffectPass) {
      for (const effect of pass.effects) {
        if (effect instanceof BloomEffect) {
          effect.intensity = THREE.MathUtils.clamp(props.bloomIntensity, 0, 2.5);
        }
      }
    }
  }
}

function initScene() {
  if (!rootRef.value || !canvasRef.value || !canRenderWebGL.value) {
    return;
  }

  disposeScene();

  const width = rootRef.value.clientWidth || window.innerWidth;
  const height = rootRef.value.clientHeight || window.innerHeight;

  const newRenderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
  });
  newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  newRenderer.setSize(width, height, false);

  const newScene = new THREE.Scene();

  const newCamera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
  newCamera.position.set(0, 0, 3.6);

  const ambient = new THREE.AmbientLight(props.secondaryColor, 1.1);
  const keyLight = new THREE.PointLight(props.accentColor, 16, 16, 2);
  keyLight.position.set(2.5, 1.5, 3.2);

  newScene.add(ambient);
  newScene.add(keyLight);

  renderer.value = newRenderer;
  scene.value = newScene;
  camera.value = newCamera;
  ambientLight.value = ambient;
  light.value = keyLight;

  rebuildParticles();

  const composerInstance = new EffectComposer(newRenderer);
  composerInstance.addPass(new RenderPass(newScene, newCamera));
  const bloom = new BloomEffect({
    intensity: THREE.MathUtils.clamp(props.bloomIntensity, 0, 2.5),
    luminanceThreshold: 0.12,
    luminanceSmoothing: 0.18,
    mipmapBlur: true,
  });
  const effectPass = new EffectPass(newCamera, bloom);
  composerInstance.addPass(effectPass);
  composer.value = composerInstance;
}

function handleResize() {
  if (!renderer.value || !camera.value || !rootRef.value) {
    return;
  }

  const width = rootRef.value.clientWidth || window.innerWidth;
  const height = rootRef.value.clientHeight || window.innerHeight;

  renderer.value.setSize(width, height, false);
  camera.value.aspect = width / height;
  camera.value.updateProjectionMatrix();
  composer.value?.setSize(width, height);
}

const { pause: pauseAnimation, resume: resumeAnimation } = useRafFn(() => {
  if (!renderer.value || !scene.value || !camera.value || !composer.value || !points.value) {
    return;
  }

  const elapsed = clock.getElapsedTime();
  const rotationSpeed = THREE.MathUtils.clamp(props.rotationSpeed, -2, 2);
  points.value.rotation.y += rotationSpeed * 0.0025;
  points.value.rotation.x += rotationSpeed * 0.0012;

  const offsets = particleOffsets.value;
  const base = basePositions.value;
  const positions = points.value.geometry?.attributes.position.array as Float32Array | undefined;

  if (offsets && base && positions) {
    const noise = THREE.MathUtils.clamp(props.noiseStrength, 0, 1.2);
    for (let index = 0; index < offsets.length; index += 1) {
      const offset = offsets[index];
      const i3 = index * 3;
      const wave = Math.sin(elapsed * 0.7 + offset) * noise * 0.45;
      positions[i3] = base[i3] + Math.cos(elapsed * 0.4 + offset) * noise * 0.18;
      positions[i3 + 1] = base[i3 + 1] + wave;
      positions[i3 + 2] = base[i3 + 2] + Math.sin(elapsed * 0.6 + offset) * noise * 0.18;
    }
    points.value.geometry.attributes.position.needsUpdate = true;
  }

  if (light.value) {
    const radius = 3.4;
    light.value.position.x = Math.sin(elapsed * 0.45) * radius;
    light.value.position.y = Math.cos(elapsed * 0.32) * 1.8;
    light.value.position.z = Math.cos(elapsed * 0.48) * radius;
  }

  composer.value.render();
});

watch(
  () => [props.primaryColor, props.secondaryColor, props.accentColor],
  () => {
    if (!canRenderWebGL.value) {
      return;
    }

    if (points.value?.material instanceof THREE.PointsMaterial) {
      points.value.material.color = new THREE.Color(props.primaryColor);
    }
    updateLighting();
  },
);

watch(
  () => props.particleDensity,
  () => {
    if (!canRenderWebGL.value) {
      return;
    }
    rebuildParticles();
  },
);

watch(
  () => props.bloomIntensity,
  () => {
    if (!canRenderWebGL.value) {
      return;
    }
    updateBloomIntensity();
  },
);

watch(
  () => props.enabled,
  (enabled) => {
    if (!enabled) {
      pauseAnimation();
      disposeScene();
      return;
    }

    if (enabled && canRenderWebGL.value) {
      initScene();
      resumeAnimation();
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!canRenderWebGL.value) {
    return;
  }

  initScene();
  resumeAnimation();
  useEventListener(window, "resize", handleResize);
});

onBeforeUnmount(() => {
  pauseAnimation();
  disposeScene();
});
</script>

<style scoped>
.hero-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: clamp(18px, 5vw, 32px);
  background: radial-gradient(
      circle at 18% 22%,
      color-mix(in srgb, var(--hero-scene-secondary) 70%, transparent 30%) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 82% 18%,
      color-mix(in srgb, var(--hero-scene-accent) 75%, transparent 25%) 0%,
      transparent 54%
    ),
    linear-gradient(
      125deg,
      color-mix(in srgb, var(--hero-scene-primary) 60%, transparent 40%) 0%,
      rgba(15, 23, 42, 0.8) 38%,
      rgba(15, 23, 42, 0.95) 72%
    );
  will-change: transform;
  pointer-events: none;
}

.hero-scene__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.hero-scene__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.hero-scene__gradient {
  width: 72%;
  max-width: 540px;
  aspect-ratio: 1;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--hero-scene-primary) 75%, transparent 25%) 0%,
    color-mix(in srgb, var(--hero-scene-secondary) 55%, transparent 45%) 52%,
    rgba(15, 23, 42, 0.9) 100%
  );
  filter: blur(0px);
  opacity: 0.72;
  transform: translateY(6%);
}

@media (max-width: 960px) {
  .hero-scene {
    border-radius: clamp(12px, 5vw, 24px);
  }

  .hero-scene__gradient {
    width: 88%;
  }
}
</style>
