/**
 * Erre-Plate design tokens
 *
 * Semantic color system for use across the app.
 * Theme engine (Material, shadcn, etc.) can be configured later.
 *
 * Usage in Tailwind: bg-eplate-tan, text-eplate-charcoal, border-eplate-gold, etc.
 */

export const eplateColors = {
  // Brand palette
  tan: "#a3866d",
  charcoal: "#2b322a",
  cream: "#d6d7d1",
  brown: "#56402b",
  gold: "#f1b84d",
  forest: "#364524",
  terracotta: "#c96b3a",

  // Semantic colors
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
} as const;

export type EplateColorToken = keyof typeof eplateColors;
