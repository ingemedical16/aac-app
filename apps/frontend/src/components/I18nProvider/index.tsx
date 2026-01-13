"use client";

import { useEffect } from "react";
import i18next from "@/lib/i18n";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
} from "@/lib/i18n/languages";

/**
 * I18nProvider
 * -----------------------------
 * Initializes and syncs application language.
 *
 * Priority:
 * 1. localStorage ("aac-language")
 * 2. browser language
 * 3. DEFAULT_LANGUAGE
 *
 * Does NOT:
 * - manipulate DOM (handled by AppEffects)
 * - depend on routing
 */
export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const storedLang =
      typeof window !== "undefined"
        ? localStorage.getItem("aac-language")
        : null;

    const browserLang =
      typeof navigator !== "undefined"
        ? navigator.language.split("-")[0]
        : null;

    const candidate =
      storedLang ??
      (browserLang && isSupportedLanguage(browserLang)
        ? browserLang
        : DEFAULT_LANGUAGE);

    const safeLang = isSupportedLanguage(candidate)
      ? candidate
      : DEFAULT_LANGUAGE;

    if (i18next.language !== safeLang) {
      i18next.changeLanguage(safeLang);
    }
  }, []);

  return <>{children}</>;
}