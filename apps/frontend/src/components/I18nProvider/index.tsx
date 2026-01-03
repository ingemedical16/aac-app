"use client";

import { useEffect, useState } from "react";
import i18next from "i18next";
import { initI18n } from "@/lib/i18n";

export default function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

useEffect(() => {
  initI18n();

  const safeLocale = ["en", "fr", "ar", "ro"].includes(locale)
    ? locale
    : "en";

  if (i18next.language !== safeLocale) {
    i18next.changeLanguage(safeLocale);
  }

  setReady(true);
}, [locale]);

  if (!ready) return null;

  return <>{children}</>;
}