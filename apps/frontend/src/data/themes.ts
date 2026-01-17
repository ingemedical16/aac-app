// src/data/themes.ts

export type ThemeName =
  | "default"
  | "calm"
  | "playful"
  | "pro";

export type ThemeDefinition = {
  key: ThemeName;
  labelKey: string; // i18n key
  cssClass?: string; // body class (optional for default)
};

/**
 * Single source of truth for themes
 * Add new themes ONLY here
 */
export const THEMES: ThemeDefinition[] = [
  {
    key: "default",
    labelKey: "theme.default",
  },
  {
    key: "calm",
    labelKey: "theme.calm",
    cssClass: "theme-calm",
  },
  {
    key: "playful",
    labelKey: "theme.playful",
    cssClass: "theme-playful",
  },
  {
    key: "pro",
    labelKey: "theme.pro",
    cssClass: "theme-pro",
  },
];

/* Helpers */

export const AVAILABLE_THEME_KEYS = THEMES.map((t) => t.key);

export function getThemeClass(theme: ThemeName): string | null {
  return THEMES.find((t) => t.key === theme)?.cssClass ?? null;
}