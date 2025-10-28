import type Lenis from "lenis";
import type { Ref, ShallowRef } from "vue";

export type LenisInstance = InstanceType<typeof Lenis>;
export type LenisScrollTarget = Parameters<LenisInstance["scrollTo"]>[0];
export type LenisScrollOptions = Parameters<LenisInstance["scrollTo"]>[1];

export interface SmoothScrollController {
  lenis: ShallowRef<LenisInstance | null>;
  isSupported: Ref<boolean>;
  isEnabled: Ref<boolean>;
  registerRoot: (element: HTMLElement | null) => void;
  scrollTo: (target: LenisScrollTarget, options?: LenisScrollOptions) => void;
  toggle: (forceState?: boolean) => void;
}

export interface SmoothScrollContext extends SmoothScrollController {}
