const baseVariant = {
  accent: "#2563eb",
  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(37, 99, 235, 0.35) 100%)",
  glow: "rgba(37, 99, 235, 0.55)",
  text: "#f8fafc",
  outline: "rgba(37, 99, 235, 0.28)",
} as const;

export const glowCardVariants = {
  violet: baseVariant,
  indigo: baseVariant,
  cyan: baseVariant,
  teal: baseVariant,
  emerald: baseVariant,
  amber: baseVariant,
  rose: baseVariant,
  slate: baseVariant,
  primary: baseVariant,
} as const;

export type GlowCardVariant = keyof typeof glowCardVariants;

export const glowCardVariantCycle = Object.keys(glowCardVariants) as GlowCardVariant[];
