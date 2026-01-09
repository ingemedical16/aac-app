"use client";

import { useEffect } from "react";
import i18next from "@/lib/i18n";
import { DEFAULT_LANGUAGE, isSupportedLanguage } from "@/lib/i18n/languages";

export default function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const safeLocale = isSupportedLanguage(locale)
      ? locale
      : DEFAULT_LANGUAGE;

    if (i18next.language !== safeLocale) {
      i18next.changeLanguage(safeLocale);
    }
  }, [locale]);

  return <>{children}</>;
}
