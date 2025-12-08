'use client';

import { useEffect, useState } from "react";
import { initI18n } from "../lib/i18n";
import i18next from "i18next";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function start() {
      initI18n();
      await i18next.init();
      setReady(true);
    }
    start();
  }, []);

  if (!ready) return null; // Prevent SSR mismatch

  return <>{children}</>;
}
