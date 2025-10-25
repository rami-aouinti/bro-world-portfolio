import type { NuxtApp } from "#app";

import { getMockTranslations } from "~/utils/i18n/mock-translations";
import { DEFAULT_LOCALE, isSupportedLocale } from "~/utils/i18n/locales";

function mergeMessages(base: unknown, overrides: Record<string, unknown>): Record<string, unknown> {
  const initial = typeof base === "object" && base !== null ? { ...(base as Record<string, unknown>) } : {};

  for (const [key, value] of Object.entries(overrides)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const existing =
        typeof initial[key] === "object" && initial[key] !== null ? (initial[key] as Record<string, unknown>) : {};
      initial[key] = mergeMessages(existing, value as Record<string, unknown>);
    } else {
      initial[key] = value;
    }
  }

  return initial;
}

function applyMockMessages(locale: string, nuxtApp: NuxtApp) {
  const i18n = nuxtApp.$i18n;
  if (!i18n) {
    return;
  }

  const normalized = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const overrides = getMockTranslations(normalized);
  const composer = i18n.global;
  const currentMessages = composer.getLocaleMessage(locale) as Record<string, unknown>;
  const merged = mergeMessages(currentMessages ?? {}, overrides);
  composer.setLocaleMessage(locale, merged);
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) {
    return;
  }

  const { $i18n } = nuxtApp;
  if (!$i18n) {
    return;
  }

  const initialLocales = $i18n.global.availableLocales;
  for (const locale of initialLocales) {
    applyMockMessages(locale, nuxtApp);
  }

  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    applyMockMessages(newLocale, nuxtApp);
  });
});
