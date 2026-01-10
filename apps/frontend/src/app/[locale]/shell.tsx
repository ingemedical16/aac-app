"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";


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
    const html = document.documentElement;
    const body = document.body;

    html.lang = locale;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);
    body.classList.toggle("hc", profile?.highContrast ?? false);
    body.classList.toggle("big", profile?.bigButtons ?? false);
  }, [locale, isRTL, profile?.highContrast, profile?.bigButtons]);

  return <>{children}</>;
}