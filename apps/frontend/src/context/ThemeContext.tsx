"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ThemeName,
  THEMES,
  AVAILABLE_THEME_KEYS,
  getThemeClass,
} from "@/data/themes";

/* =========================
   TYPES
========================= */

type ThemeContextValue = {
  /* appearance modes */
  highContrast: boolean;
  bigButtons: boolean;

  toggleHighContrast: () => void;
  toggleBigButtons: () => void;

  /* themes */
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: typeof THEMES;
};

/* =========================
   STORAGE KEYS
========================= */

const STORAGE_THEME = "aac.theme";
const STORAGE_HC = "aac.highContrast";
const STORAGE_BIG = "aac.bigButtons";

/* =========================
   CONTEXT
========================= */

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* =========================
   PROVIDER
========================= */

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>("default");
  const [highContrast, setHighContrast] = useState(false);
  const [bigButtons, setBigButtons] = useState(false);

  /* =========================
     BOOTSTRAP
  ========================= */

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_THEME) as ThemeName | null;
    const storedHC = localStorage.getItem(STORAGE_HC);
    const storedBig = localStorage.getItem(STORAGE_BIG);

    if (storedTheme && AVAILABLE_THEME_KEYS.includes(storedTheme)) {
      setThemeState(storedTheme);
    }

    if (storedHC === "true") setHighContrast(true);
    if (storedBig === "true") setBigButtons(true);
  }, []);

  /* =========================
     APPLY TO DOM
  ========================= */

  useEffect(() => {
    const body = document.body;

    // remove all theme classes
    THEMES.forEach((t) => {
      if (t.cssClass) body.classList.remove(t.cssClass);
    });

    const themeClass = getThemeClass(theme);
    if (themeClass) body.classList.add(themeClass);

    body.classList.toggle("hc", highContrast);
    body.classList.toggle("big", bigButtons);

    localStorage.setItem(STORAGE_THEME, theme);
    localStorage.setItem(STORAGE_HC, String(highContrast));
    localStorage.setItem(STORAGE_BIG, String(bigButtons));
  }, [theme, highContrast, bigButtons]);

  /* =========================
     ACTIONS
  ========================= */

  const toggleHighContrast = () => setHighContrast((v) => !v);
  const toggleBigButtons = () => setBigButtons((v) => !v);

  const setTheme = (next: ThemeName) => {
    if (AVAILABLE_THEME_KEYS.includes(next)) {
      setThemeState(next);
    }
  };

  /* =========================
     VALUE
  ========================= */

  const value = useMemo<ThemeContextValue>(
    () => ({
      highContrast,
      bigButtons,
      toggleHighContrast,
      toggleBigButtons,

      theme,
      setTheme,
      availableThemes: THEMES,
    }),
    [highContrast, bigButtons, theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}