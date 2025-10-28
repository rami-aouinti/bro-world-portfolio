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
    const lenis = lenisRef.value;
    const isLenisRunning = !!lenis && !lenis.isStopped;
    setDocumentState(isSupported.value && isEnabled.value && isLenisRunning);
  }

  function destroyLenis() {
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
    lenisRef.value.start();
    refreshDocumentState();
  }

  function stopLenis() {
    if (!lenisRef.value) {
      return;
    }
    lenisRef.value.stop();
    refreshDocumentState();
  }

  function createLenis() {
    if (!rootElement || !isSupported.value) {
      return;
    }

    destroyLenis();

    const contentElement =
      (rootElement.querySelector(
        ":scope > [data-lenis-content]",
      ) as HTMLElement | null) ??
      (rootElement.firstElementChild as HTMLElement | null) ??
      rootElement;

    const instance = new Lenis({
      wrapper: rootElement,
      content: contentElement,
      autoRaf: true,
      smoothWheel: true,
      smoothTouch: false,
      normalizeWheel: true,
      duration: 1.1,
    });

    lenisRef.value = instance;

    instance.scrollTo(0, { immediate: true });

    if (!isEnabled.value) {
      instance.stop();
    }

    refreshDocumentState();
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
      return;
    }

    if (!lenisRef.value && rootElement && isSupported.value) {
      createLenis();
    }

    startLenis();
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
      return;
    }
    if (!lenisRef.value && rootElement && isSupported.value) {
      createLenis();
    }
    startLenis();
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
