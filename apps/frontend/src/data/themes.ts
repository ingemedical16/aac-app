/* =====================================================
   THEMES — AAC APPLICATION
   Single Source of Truth
===================================================== */

/**
 * ThemeName
 * -----------------------------------------------------
 * Logical theme identifiers (used in state, storage, etc.)
 * DO NOT put CSS class names here.
 */
export type ThemeName =
  | "default"
  | "calm"
  | "playful"
  | "pro"
  | "dark"
  | "school"
  | "autism-soft";

/**
 * ThemeDefinition
 * -----------------------------------------------------
 * - key: logical theme name
 * - labelKey: i18n key
 * - cssClass: body class applied (undefined = default theme)
 */
export type ThemeDefinition = {
  key: ThemeName;
  labelKey: string;
  cssClass?: string;
};

/**
 * THEMES
 * -----------------------------------------------------
 * Add new themes ONLY here.
 * variables.scss MUST define the matching body class.
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
    labelKey: "theme.professional",
    cssClass: "theme-pro",
  },
  {
    key: "dark",
    labelKey: "theme.dark",
    cssClass: "theme-dark",
  },
  {
    key: "school",
    labelKey: "theme.school",
    cssClass: "theme-school",
  },
  {
    key: "autism-soft",
    labelKey: "theme.autismSoft",
    cssClass: "theme-autism-soft",
  },
];

/* =====================================================
   HELPERS
===================================================== */

/**
 * List of valid theme keys
 */
export const AVAILABLE_THEME_KEYS: ThemeName[] =
  THEMES.map((t) => t.key);

/**
 * Returns the CSS class to apply on <body>
 * - default → null (no class)
 * - others → theme-* class
 */
export function getThemeClass(
  theme: ThemeName
): string | null {
  return (
    THEMES.find((t) => t.key === theme)?.cssClass ??
    null
  );
}