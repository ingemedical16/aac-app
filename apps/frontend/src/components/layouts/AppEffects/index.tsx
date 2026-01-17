"use client";

import { useEffect } from "react";
import i18next from "@/lib/i18n";
import { useTheme } from "@/context/ThemeContext";

/**
 * AppEffects
 * ---------------------------------------
 * Global DOM side-effects only:
 * - lang / dir (RTL / LTR)
 * - theme class
 * - accessibility modes (HC / BIG)
 *
 * Mounted once in app/layout.tsx
 */
export default function AppEffects() {
  const { theme, highContrast, bigButtons } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    /* =========================
       LANGUAGE / DIRECTION
    ========================= */

    const lang = i18next.language || "en";
    const isRTL = lang === "ar";

    html.lang = lang;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);

    /* =========================
       THEME
    ========================= */

    body.classList.remove(
      "theme-calm",
      "theme-playful",
      "theme-pro"
    );

    if (theme && theme !== "default") {
      body.classList.add(`theme-${theme}`);
    }

    /* =========================
       ACCESSIBILITY
    ========================= */

    body.classList.toggle("hc", highContrast);
    body.classList.toggle("big", bigButtons);
  }, [
    theme,
    highContrast,
    bigButtons,
    i18next.language,
  ]);

  return null;
}