// src/app/layout.tsx
import I18nProvider from "@/components/I18nProvider";
import AppEffects from "@/components/layouts/AppEffects";
import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import "@/styles/globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>
            <UserProfileProvider>
              <AppEffects />
              {children}
            </UserProfileProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
