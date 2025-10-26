import { computed, watch, watchEffect } from "vue";
import { useColorMode } from "@vueuse/core";
import { useCookie, useHead, useRequestHeaders } from "#imports";
import { withSecureCookieOptions } from "~/lib/cookies";
import { useTheme } from "vuetify";

export type ColorModeValue = "light" | "dark" | "auto";
export type ResolvedColorMode = "light" | "dark";

function resolveSystemColorPreference(hint: ResolvedColorMode | null): ResolvedColorMode | null {
  if (hint) {
    return hint;
  }

  if (import.meta.client && typeof window !== "undefined") {
    const supportsMatchMedia = typeof window.matchMedia === "function";

    if (supportsMatchMedia) {
      try {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }

        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      } catch {
        // ignore matchMedia errors and fall through to the fallback value
      }
    }
  }

  return null;
}

function resolveResolvedColorMode(
  value: ColorModeValue | null | undefined,
  hint: ResolvedColorMode | null,
): ResolvedColorMode {
  if (value === "dark" || value === "light") {
    return value;
  }

  const systemPreference = resolveSystemColorPreference(hint);

  if (systemPreference) {
    return systemPreference;
  }

  return "dark";
}

export function resolveInitialColorMode(): ResolvedColorMode {
  const colorModeCookie = useCookie<ColorModeValue | null>(
    "color-mode",
    withSecureCookieOptions({
      sameSite: "lax",
      watch: false,
    }),
  );

  const colorSchemeHint = import.meta.server
    ? ((useRequestHeaders(["sec-ch-prefers-color-scheme"])["sec-ch-prefers-color-scheme"] ??
        null) as ResolvedColorMode | null)
    : null;

  return resolveResolvedColorMode(colorModeCookie.value, colorSchemeHint);
}

export function useCookieColorMode() {
  const colorModeCookie = useCookie<ColorModeValue>(
    "color-mode",
    withSecureCookieOptions({
      sameSite: "lax",
      default: () => "dark",
    }),
  );

  const initialValue = colorModeCookie.value ?? "dark";

  const colorMode = useColorMode<ColorModeValue>({
    storageKey: "color-mode",
    initialValue,
    storage: {
      getItem: () => colorModeCookie.value ?? "auto",
      setItem: (_, value) => {
        colorModeCookie.value = value as ColorModeValue;
      },
      removeItem: () => {
        colorModeCookie.value = null;
      },
    },
  });

  const colorSchemeHint = import.meta.server
    ? ((useRequestHeaders(["sec-ch-prefers-color-scheme"])["sec-ch-prefers-color-scheme"] ??
        null) as ResolvedColorMode | null)
    : null;

  const initialResolvedMode = resolveResolvedColorMode(initialValue, colorSchemeHint);

  if (colorMode.value !== initialValue) {
    colorMode.value = initialValue;
  }

  watch(
    () => colorMode.value,
    (value) => {
      if (colorModeCookie.value !== value) {
        colorModeCookie.value = value;
      }
    },
    { immediate: true },
  );

  watch(
    () => colorModeCookie.value,
    (value) => {
      const normalized = value ?? "auto";

      if (value == null) {
        colorModeCookie.value = normalized;
        return;
      }

      if (colorMode.value !== normalized) {
        colorMode.value = normalized;
      }
    },
  );

  const resolvedMode = computed<"light" | "dark">(() => {
    if (colorMode.value === "auto") {
      if (import.meta.server) {
        return initialResolvedMode;
      }

      return colorMode.system.value === "dark" ? "dark" : "light";
    }

    return colorMode.value === "dark" ? "dark" : "light";
  });

  const vuetifyTheme = (() => {
    try {
      return useTheme();
    } catch {
      return null;
    }
  })();

  if (vuetifyTheme && import.meta.client) {
    watch(
      resolvedMode,
      (mode) => {
        const target = mode === "dark" ? "dark" : "light";

        if (vuetifyTheme.global.name.value !== target) {
          vuetifyTheme.change(target);
        }
      },
      { immediate: true },
    );
  }

  useHead({
    htmlAttrs: computed(() => {
      const isDark = resolvedMode.value === "dark";

      return {
        class: isDark ? "dark" : undefined,
        "data-theme": isDark ? "dark" : "light",
      };
    }),
  });

  if (import.meta.client) {
    watchEffect(() => {
      const isDark = resolvedMode.value === "dark";
      const classList = document.documentElement.classList;

      classList.toggle("dark", isDark);
      classList.remove("theme--dark", "theme--light");
      document.documentElement.dataset.theme = isDark ? "dark" : "light";
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    });
  }

  return colorMode;
}
