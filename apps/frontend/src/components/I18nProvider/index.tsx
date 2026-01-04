"use client";

import { useEffect, useRef } from "react";
import i18next from "i18next";
import { initI18n } from "@/lib/i18n";

const SUPPORTED_LOCALES = ["en", "fr", "ar", "ro"] as const;

export default function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    // ✅ Initialize i18n ONCE
    if (!initialized.current) {
      initI18n();
      initialized.current = true;
    }

    // ✅ Sanitize locale
    const safeLocale = SUPPORTED_LOCALES.includes(
      locale as (typeof SUPPORTED_LOCALES)[number]
    )
      ? locale
      : "en";

    // ✅ Change language ONLY if needed
    if (i18next.language !== safeLocale) {
      i18next.changeLanguage(safeLocale);
    }
  }, [locale]);

  return <>{children}</>;
}