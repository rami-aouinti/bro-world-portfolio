import { useLocalStorage } from "@vueuse/core";
import { watchEffect } from "vue";

export type AdminGlassIntensity = "subtle" | "balanced" | "bold";
export type AdminCornerStyle = "rounded" | "pill" | "square";

export interface AdminDesignSettings {
  glassIntensity: AdminGlassIntensity;
  cornerStyle: AdminCornerStyle;
  accentGlow: boolean;
  showGrid: boolean;
}

const STORAGE_KEY = "admin-design-settings";

const DEFAULT_SETTINGS: AdminDesignSettings = {
  glassIntensity: "balanced",
  cornerStyle: "rounded",
  accentGlow: true,
  showGrid: false,
};

const GLASS_PRESETS: Record<AdminGlassIntensity, { blur: string; surface: string; border: string; shadow: string }> = {
  subtle: {
    blur: "12px",
    surface: "rgba(15, 23, 42, 0.8)",
    border: "rgba(148, 163, 184, 0.18)",
    shadow: "rgba(15, 23, 42, 0.6)",
  },
  balanced: {
    blur: "18px",
    surface: "rgba(15, 23, 42, 0.88)",
    border: "rgba(148, 163, 184, 0.25)",
    shadow: "rgba(15, 23, 42, 0.75)",
  },
  bold: {
    blur: "26px",
    surface: "rgba(15, 23, 42, 0.94)",
    border: "rgba(148, 163, 184, 0.35)",
    shadow: "rgba(15, 23, 42, 0.85)",
  },
};

const CORNER_PRESETS: Record<AdminCornerStyle, { surfaceRadius: string; controlRadius: string }> = {
  rounded: {
    surfaceRadius: "28px",
    controlRadius: "999px",
  },
  pill: {
    surfaceRadius: "36px",
    controlRadius: "999px",
  },
  square: {
    surfaceRadius: "18px",
    controlRadius: "26px",
  },
};

export function useAdminDesignSettings() {
  const settings = useLocalStorage<AdminDesignSettings>(STORAGE_KEY, DEFAULT_SETTINGS, {
    mergeDefaults: true,
  });

  if (import.meta.client) {
    watchEffect(() => {
      const currentSettings = settings.value;
      const root = document.documentElement;
      const glass = GLASS_PRESETS[currentSettings.glassIntensity] ?? GLASS_PRESETS.balanced;
      const corners = CORNER_PRESETS[currentSettings.cornerStyle] ?? CORNER_PRESETS.rounded;

      root.style.setProperty("--admin-glass-blur", glass.blur);
      root.style.setProperty("--admin-glass-surface", glass.surface);
      root.style.setProperty("--admin-glass-border", glass.border);
      root.style.setProperty("--admin-surface-shadow", glass.shadow);
      root.style.setProperty("--admin-surface-radius", corners.surfaceRadius);
      root.style.setProperty("--admin-control-radius", corners.controlRadius);
      root.style.setProperty(
        "--admin-accent-glow-opacity",
        currentSettings.accentGlow ? "1" : "0",
      );

      root.dataset.adminGrid = currentSettings.showGrid ? "on" : "off";
    });
  }

  function updateSetting<K extends keyof AdminDesignSettings>(key: K, value: AdminDesignSettings[K]) {
    settings.value = {
      ...settings.value,
      [key]: value,
    };
  }

  return {
    settings,
    updateSetting,
  };
}
