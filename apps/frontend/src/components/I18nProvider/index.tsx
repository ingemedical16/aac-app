"use client";

import { useEffect, useRef } from "react";
import i18next from "i18next";
import { initI18n } from "@/lib/i18n";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
} from "@/lib/i18n/languages";

export default function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initI18n();
      initialized.current = true;
    }

    const safeLocale = isSupportedLanguage(locale)
      ? locale
      : DEFAULT_LANGUAGE;

    if (i18next.language !== safeLocale) {
      i18next.changeLanguage(safeLocale);
    }
  }, [locale]);

  return <>{children}</>;
}
