"use client";

import { useEffect, useState } from "react";
import { initI18n } from "@/lib/i18n";
import i18next from "i18next";

export default function I18nProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initI18n();                 // ✅ NO args, NO .then
    i18next.changeLanguage(locale);
    setReady(true);
  }, [locale]);

  if (!ready) return null;

  return <>{children}</>;
}
