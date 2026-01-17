"use client";

import { useEffect } from "react";
import i18next from "@/lib/i18n";

/**
 * AppEffects
 * ---------------------------------------
 * Global DOM side-effects ONLY:
 * - language
 * - direction (RTL / LTR)
 *
 * Theme & accessibility are handled
 * exclusively by ThemeContext
 */
export default function AppEffects() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const lang = i18next.language || "en";
    const isRTL = lang === "ar";

    html.lang = lang;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);
  }, [i18next.language]);

  return null;
}