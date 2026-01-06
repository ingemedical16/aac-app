// src/app/[locale]/layout.tsx
import I18nProvider from "@/components/I18nProvider";
import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import ClientShell from "./shell";

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
} from "@/lib/i18n/languages";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  // ✅ SANITIZE ROUTE PARAM ONCE
  const safeLocale = isSupportedLanguage(rawLocale)
    ? rawLocale
    : DEFAULT_LANGUAGE;

  return (
    <AuthProvider>
    <UserProfileProvider>
      <I18nProvider locale={safeLocale}>
        
          <ClientShell locale={safeLocale}>
            {children}
          </ClientShell>
       
      </I18nProvider>
    </UserProfileProvider>
     </AuthProvider>
  );
}