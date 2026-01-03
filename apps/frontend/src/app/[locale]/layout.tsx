"use client";

import { use, useEffect } from "react";
import I18nProvider from "@/components/I18nProvider";
import { AuthProvider } from "@/context/AuthContext";
import {
  UserProfileProvider,
  useUserProfile,
} from "@/context/UserProfileContext";

function Shell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { profile } = useUserProfile();
  const isRTL = locale === "ar";

  /* =========================
     🔥 CRITICAL FIX
     Synchronize BODY & HTML
  ========================= */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Language + direction
    html.lang = locale;
    html.dir = isRTL ? "rtl" : "ltr";

    // Direction classes
    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);

    // Accessibility
    body.classList.toggle("hc", profile.settings.highContrast);
    body.classList.toggle("big", profile.settings.bigButtons);
  }, [
    locale,
    isRTL,
    profile.settings.highContrast,
    profile.settings.bigButtons,
  ]);

  return (
    <I18nProvider locale={locale}>
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";

  return (
    <UserProfileProvider>
      <Shell locale={locale}>{children}</Shell>
    </UserProfileProvider>
  );
}