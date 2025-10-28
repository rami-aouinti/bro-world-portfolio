import Lenis from "lenis";
import { onScopeDispose, ref, shallowRef, watch } from "vue";
import type {
  SmoothScrollController,
  LenisInstance,
  LenisScrollOptions,
  LenisScrollTarget,
} from "~/types/smooth-scroll";

export default defineNuxtPlugin(() => {
  const lenisRef = shallowRef<LenisInstance | null>(null);
  const isSupported = ref(false);
  const isEnabled = ref(false);
  let rafId = 0;
  let rootElement: HTMLElement | null = null;
  let prefersReducedMotion: MediaQueryList | null = null;

  function setDocumentState(active: boolean) {
    if (!import.meta.client) {
      return;
    }
    const classList = document.documentElement.classList;
    classList.toggle("has-smooth-scroll", active);
  }

  function refreshDocumentState() {
    setDocumentState(isSupported.value && isEnabled.value && !!lenisRef.value);
  }

  function cancelRaf() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  const animate = (time: number) => {
    if (!lenisRef.value) {
      return;
    }
    lenisRef.value.raf(time);
    rafId = requestAnimationFrame(animate);
  };

  function destroyLenis() {
    cancelRaf();
    if (lenisRef.value) {
      lenisRef.value.destroy();
      lenisRef.value = null;
    }
    refreshDocumentState();
  }

  function startLenis() {
    if (!lenisRef.value || !isEnabled.value) {
      return;
    }
    cancelRaf();
    rafId = requestAnimationFrame(animate);
    lenisRef.value.start();
  }

  function stopLenis() {
    if (!lenisRef.value) {
      return;
    }
    lenisRef.value.stop();
    cancelRaf();
  }

  function createLenis() {
    if (!rootElement || !isSupported.value) {
      return;
    }

    destroyLenis();

    const contentElement = (rootElement.firstElementChild as HTMLElement | null) ?? rootElement;

    const instance = new Lenis({
      wrapper: rootElement,
      content: contentElement,
      autoRaf: false,
      smoothWheel: true,
      smoothTouch: false,
      normalizeWheel: true,
      duration: 1.1,
    });

    lenisRef.value = instance;
    refreshDocumentState();

    if (isEnabled.value) {
      startLenis();
    } else {
      stopLenis();
    }
  }

  function updateSupportState() {
    const prefersReduced = prefersReducedMotion?.matches ?? false;
    isSupported.value = !prefersReduced && typeof window !== "undefined" && "requestAnimationFrame" in window;
    if (!isSupported.value) {
      isEnabled.value = false;
      destroyLenis();
    } else {
      if (!lenisRef.value && rootElement) {
        createLenis();
      }
    }
    refreshDocumentState();
  }

  function registerRoot(element: HTMLElement | null) {
    rootElement = element;
    if (!rootElement) {
      destroyLenis();
      return;
    }

    if (!isSupported.value) {
      return;
    }

    createLenis();
  }

  function scrollTo(target: LenisScrollTarget, options?: LenisScrollOptions) {
    lenisRef.value?.scrollTo(target, options);
  }

  function toggle(forceState?: boolean) {
    const nextState = typeof forceState === "boolean" ? forceState : !isEnabled.value;
    isEnabled.value = nextState;
    if (!nextState) {
      stopLenis();
    } else {
      if (!lenisRef.value) {
        createLenis();
      }
      startLenis();
    }
    refreshDocumentState();
  }

  if (import.meta.client) {
    prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
    if (prefersReducedMotion) {
      prefersReducedMotion.addEventListener("change", updateSupportState);
    }
    isEnabled.value = true;
    updateSupportState();
  }

  const controller: SmoothScrollController = {
    lenis: lenisRef,
    isSupported,
    isEnabled,
    registerRoot,
    scrollTo,
    toggle,
  };

  watch(isEnabled, (value) => {
    if (!value) {
      stopLenis();
    } else {
      startLenis();
    }
    refreshDocumentState();
  });

  onScopeDispose(() => {
    prefersReducedMotion?.removeEventListener("change", updateSupportState);
    destroyLenis();
    setDocumentState(false);
  });

  return {
    provide: {
      smoothScroll: controller,
    },
  };
});
