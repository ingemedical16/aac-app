"use client";

import { use } from "react";
import I18nProvider from "@/components/I18nProvider";
import AppHeader from "@/components/AppHeader";
import {
  UserProfileProvider,
  useUserProfile,
} from "@/context/UserProfileContext";
import "../../styles/globals.scss";

function Shell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { profile } = useUserProfile();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={[
          isRTL ? "rtl" : "ltr", // ✅ CRITICAL FIX
          profile.settings.highContrast ? "hc" : "",
          profile.settings.bigButtons ? "big" : "",
        ].join(" ")}
      >
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
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
