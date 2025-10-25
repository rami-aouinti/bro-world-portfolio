export const glowCardVariants = {
  violet: {
    accent: "#7c3aed",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(124, 58, 237, 0.35) 100%)",
    glow: "rgba(124, 58, 237, 0.55)",
    text: "#f8fafc",
    outline: "rgba(124, 58, 237, 0.28)",
  },
  indigo: {
    accent: "#6366f1",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(99, 102, 241, 0.35) 100%)",
    glow: "rgba(99, 102, 241, 0.5)",
    text: "#f8fafc",
    outline: "rgba(99, 102, 241, 0.26)",
  },
  cyan: {
    accent: "#06b6d4",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(6, 182, 212, 0.32) 100%)",
    glow: "rgba(6, 182, 212, 0.48)",
    text: "#f8fafc",
    outline: "rgba(6, 182, 212, 0.26)",
  },
  teal: {
    accent: "#14b8a6",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(20, 184, 166, 0.32) 100%)",
    glow: "rgba(20, 184, 166, 0.45)",
    text: "#f8fafc",
    outline: "rgba(20, 184, 166, 0.24)",
  },
  emerald: {
    accent: "#10b981",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(16, 185, 129, 0.35) 100%)",
    glow: "rgba(16, 185, 129, 0.45)",
    text: "#f8fafc",
    outline: "rgba(16, 185, 129, 0.25)",
  },
  amber: {
    accent: "#f59e0b",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(245, 158, 11, 0.3) 100%)",
    glow: "rgba(245, 158, 11, 0.4)",
    text: "#fff8eb",
    outline: "rgba(245, 158, 11, 0.22)",
  },
  rose: {
    accent: "#f472b6",
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(244, 114, 182, 0.35) 100%)",
    glow: "rgba(244, 114, 182, 0.45)",
    text: "#fff5fb",
    outline: "rgba(244, 114, 182, 0.24)",
  },
  slate: {
    accent: "#64748b",
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(100, 116, 139, 0.32) 100%)",
    glow: "rgba(100, 116, 139, 0.45)",
    text: "#f8fafc",
    outline: "rgba(100, 116, 139, 0.24)",
  },
} as const;

export type GlowCardVariant = keyof typeof glowCardVariants;

export const glowCardVariantCycle = Object.keys(glowCardVariants) as GlowCardVariant[];
