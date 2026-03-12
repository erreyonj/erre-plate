/**
 * Erre-Plate mobile color constants
 *
 * Mirrors the design tokens in frontend/design/theme.ts.
 * Use these values inside StyleSheet.create() calls.
 * For NativeWind className usage, use the `eplate-*` Tailwind tokens
 * defined in tailwind.config.js (e.g. `bg-eplate-charcoal`).
 */

export const colors = {
  // Brand palette
  tan:        '#a3866d',
  charcoal:   '#2b322a',
  cream:      '#d6d7d1',
  brown:      '#56402b',
  gold:       '#f1b84d',
  forest:     '#364524',
  terracotta: '#c96b3a',
  turquoise:  '#038568',

  // Extended neutrals
  offWhite:  '#fcfcfa',
  lightGray: '#e8e9e4',
  midGray:   '#9a9d95',
  darkGray:  '#4a5248',

  // Semantic
  success: '#22c55e',
  error:   '#ef4444',
  info:    '#3b82f6',
  warning: '#f59e0b',
} as const;

export type ColorToken = keyof typeof colors;
