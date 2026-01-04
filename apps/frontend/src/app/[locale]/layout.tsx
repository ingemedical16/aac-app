// src/app/[locale]/layout.tsx
import I18nProvider from "@/components/I18nProvider";
import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import ClientShell from "./shell";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <UserProfileProvider>
      <I18nProvider locale={locale}>
        <AuthProvider>
          <ClientShell locale={locale}>
            {children}
          </ClientShell>
        </AuthProvider>
      </I18nProvider>
    </UserProfileProvider>
  );
}