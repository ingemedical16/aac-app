"use client";

import { use } from "react";
import I18nProvider from "@/components/I18nProvider";
import AppHeader from "@/components/AppHeader";
import { HighContrastProvider } from "@/context/HighContrastContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import "../../styles/globals.scss";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserProfileProvider>
          <HighContrastProvider>
            <I18nProvider locale={locale}>
              <AppHeader />
              {children}
            </I18nProvider>
          </HighContrastProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
}
