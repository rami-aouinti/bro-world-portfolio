import type { createPinia } from "~/lib/pinia-shim";

declare module "#app" {
  interface NuxtApp {
    $pinia: ReturnType<typeof createPinia>;
  }

  interface NuxtPayload {
    pinia?: Record<string, unknown>;
  }
}

export {};
