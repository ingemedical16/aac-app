"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { withLocale } from "@/lib/navigation/withLocale";

/**
 * RoleGate
 * 🔐 Guards routes and redirects to the correct dashboard page
 * ❌ Does NOT render UI
 * ❌ Does NOT decide AAC board logic
 */
export default function RoleGate() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "en";

  const { isReady, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    // 🚫 Not authenticated → login
    if (!isAuthenticated || !user) {
      router.replace(withLocale(locale, "/login"));
      return;
    }

    // 🔀 Role-based dashboard routing
    switch (user.role) {
      case "ADMIN":
        router.replace(withLocale(locale, "/admin"));
        return;

      case "PROFESSIONAL":
        router.replace(withLocale(locale, "/professional/dashboard"));
        return;

      case "PATIENT":
        router.replace(withLocale(locale, "/patient/dashboard"));
        return;

      default:
        router.replace(withLocale(locale, "/"));
        return;
    }
  }, [isReady, isAuthenticated, user, locale, router]);

  // ⏳ No UI
  return null;
}