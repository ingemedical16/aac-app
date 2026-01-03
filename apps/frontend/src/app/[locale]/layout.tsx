// src/app/[locale]/layout.tsx
"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.lang = locale;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);
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
  params: { locale: string };
}) {
  return (
    <UserProfileProvider>
      <Shell locale={params.locale}>{children}</Shell>
    </UserProfileProvider>
  );
}