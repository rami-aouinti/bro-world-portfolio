import { ref, shallowRef } from "vue";
import type { SmoothScrollController } from "~/types/smooth-scroll";

const FALLBACK_CONTROLLER: SmoothScrollController = {
  lenis: shallowRef(null),
  isSupported: ref(false),
  isEnabled: ref(false),
  registerRoot: () => {},
  scrollTo: () => {},
  toggle: () => {},
};

export function useSmoothScroll(): SmoothScrollController {
  const nuxtApp = useNuxtApp();
  const controller = nuxtApp.$smoothScroll ?? FALLBACK_CONTROLLER;
  return controller;
}
