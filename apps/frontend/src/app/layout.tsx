import { SpeedInsights } from '@vercel/speed-insights/next';
// src/app/layout.tsx
import "@/styles/globals.scss";

import I18nProvider from "@/components/I18nProvider";
import AppEffects from "@/components/layouts/AppEffects";

import { AuthProvider } from "@/context/AuthContext";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
              <ThemeProvider>
                <AppEffects />
                {children}
                <SpeedInsights />
              </ThemeProvider>
            </UserProfileProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}