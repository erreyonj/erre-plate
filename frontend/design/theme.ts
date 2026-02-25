/**
 * Erre-Plate design tokens
 *
 * Semantic color system for use across the app.
 * Includes MUI theme integration with light/dark mode support.
 *
 * Usage in Tailwind: bg-eplate-tan, text-eplate-charcoal, border-eplate-gold, etc.
 */

import { createContext, useState, useMemo } from "react";
import { createTheme, type PaletteMode } from "@mui/material/styles";

// ─── Raw tokens ───────────────────────────────────────────────────────────────

export const eplateColors = {
  // Brand palette
  tan: "#a3866d",
  charcoal: "#2b322a",
  cream: "#d6d7d1",
  brown: "#56402b",
  gold: "#f1b84d",
  forest: "#364524",
  terracotta: "#c96b3a",
  turquoise: "#038568",

  // Extended neutrals (for surface/bg layering)
  offWhite: "#fcfcfa",
  lightGray: "#e8e9e4",
  midGray: "#9a9d95",
  darkGray: "#4a5248",

  // Semantic colors
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
} as const;

export type EplateColorToken = keyof typeof eplateColors;

// ─── Typography ───────────────────────────────────────────────────────────────

const beVietnam = ["Be Vietnam Pro", "sans-serif"].join(",");

// ─── MUI theme settings ───────────────────────────────────────────────────────

export const themeSettings = (mode: PaletteMode) => {
  const isDark = mode === "dark";

  return {
    palette: {
      mode,
      primary: {
        main: eplateColors.turquoise,
        light: eplateColors.tan,
        dark: eplateColors.charcoal,
        contrastText: eplateColors.offWhite,
      },
      secondary: {
        main: eplateColors.gold,
        light: "#f5cc7f",
        dark: eplateColors.brown,
        contrastText: eplateColors.charcoal,
      },
      third: {main: eplateColors.terracotta},
      error: { main: eplateColors.error },
      warning: { main: eplateColors.warning },
      info: { main: eplateColors.info },
      success: { main: eplateColors.success },
      neutral: {
        dark: isDark ? eplateColors.cream : eplateColors.darkGray,
        main: isDark ? eplateColors.midGray : eplateColors.midGray,
        light: isDark ? eplateColors.darkGray : eplateColors.lightGray,
      },
      background: {
        default: isDark ? eplateColors.charcoal : eplateColors.offWhite,
        paper: isDark ? eplateColors.darkGray : "#ffffff",
        softGray: isDark ? eplateColors.lightGray : eplateColors.darkGray
      },
      text: {
        primary: isDark ? eplateColors.cream : eplateColors.charcoal,
        secondary: isDark ? eplateColors.midGray : eplateColors.darkGray,
      },
      divider: isDark ? eplateColors.darkGray : eplateColors.lightGray,
    },
    typography: {
      fontFamily: beVietnam,
      fontSize: 12,
      h1: { fontFamily: beVietnam, fontSize: 40, fontWeight: 700 },
      h2: { fontFamily: beVietnam, fontSize: 32, fontWeight: 600 },
      h3: { fontFamily: beVietnam, fontSize: 24, fontWeight: 600 },
      h4: { fontFamily: beVietnam, fontSize: 20, fontWeight: 500 },
      h5: { fontFamily: beVietnam, fontSize: 16, fontWeight: 500 },
      h6: { fontFamily: beVietnam, fontSize: 14, fontWeight: 500 },
      body1: { fontFamily: beVietnam, fontSize: 14 },
      body2: { fontFamily: beVietnam, fontSize: 12 },
      button: { fontFamily: beVietnam, fontWeight: 600, textTransform: "none" as const },
    },
  };
};

// ─── Color mode context ───────────────────────────────────────────────────────

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode] as const;
};