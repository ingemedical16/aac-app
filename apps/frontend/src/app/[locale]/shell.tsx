// src/app/[locale]/shell.tsx
"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import AuthGate from "@/components/auth/AuthGate";

export default function ClientShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { profile } = useUserProfile();
  const isRTL = locale === "ar";

  useEffect(() => {
    if (!profile) return;

    const html = document.documentElement;
    const body = document.body;

    html.lang = locale;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);
    body.classList.toggle("hc", profile.highContrast);
    body.classList.toggle("big", profile.bigButtons);
  }, [locale, isRTL, profile]);

  return (
    <>
      {children}
    </>
   
  );
}