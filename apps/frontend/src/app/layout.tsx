// src/app/layout.tsx
import I18nProvider from "@/components/I18nProvider";
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
      <body suppressHydrationWarning> <AuthProvider>
          <UserProfileProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </UserProfileProvider>
           </AuthProvider>
          </body>
    </html>
  );
}