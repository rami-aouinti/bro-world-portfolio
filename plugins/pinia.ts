import type { Plugin } from "vue";
import { defineNuxtPlugin } from "#app";
import { createPinia, setActivePinia } from "~/lib/pinia-shim";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();

  const installable = pinia as unknown as Plugin;
  nuxtApp.vueApp.use(installable);
  setActivePinia(pinia);
  nuxtApp.$pinia = pinia;

  if (import.meta.server) {
    nuxtApp.hook("app:rendered", () => {
      (nuxtApp.payload as Record<string, unknown>).pinia = JSON.parse(JSON.stringify(pinia.state));
    });
  }

  if (import.meta.client) {
    const payloadState = (nuxtApp.payload as Record<string, unknown>).pinia;
    if (payloadState && typeof payloadState === "object") {
      Object.assign(pinia.state, payloadState);
    }
  }

  return {
    provide: {
      pinia,
    },
  };
});
