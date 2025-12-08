"use client";

import { useEffect, useState } from "react";
import { initI18n } from "@/lib/i18n";
import i18next from "i18next";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initI18n();
    i18next.init().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
