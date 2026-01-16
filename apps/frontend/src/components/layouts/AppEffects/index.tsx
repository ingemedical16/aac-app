"use client";

import { useEffect } from "react";
import i18next from "@/lib/i18n";
import { useUserProfile } from "@/context/UserProfileContext";

/**
 * AppEffects
 * ---------------------------------------
 * Global DOM side-effects only:
 * - lang / dir (RTL / LTR)
 * - accessibility modes (HC / BIG)
 *
 * Mounted once in app/layout.tsx
 */
export default function AppEffects() {
  const { profile } = useUserProfile(); // ✅ correct field

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    /* =========================
       LANGUAGE / DIRECTION
    ========================= */

    const lang = i18next.language || "en";
    const isRTL = lang === "ar";

    html.lang = lang;
    html.dir = isRTL ? "rtl" : "ltr";

    body.classList.toggle("rtl", isRTL);
    body.classList.toggle("ltr", !isRTL);

    /* =========================
       ACCESSIBILITY (PROFILE-BASED)
    ========================= */

    body.classList.toggle("hc", Boolean(profile?.highContrast));
    body.classList.toggle("big", Boolean(profile?.bigButtons));
  }, [
    profile?.highContrast,
    profile?.bigButtons,
    i18next.language,
  ]);

  return null;
}