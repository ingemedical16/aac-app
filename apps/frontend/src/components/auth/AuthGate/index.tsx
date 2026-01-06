"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { withLocale } from "@/lib/navigation/withLocale";
import type { UserRole } from "@/types/auth";

interface AuthGateProps {
  children: React.ReactNode;
  roles?: UserRole[]; // 👈 optional RBAC
}

export default function AuthGate({ children, roles }: AuthGateProps) {
  const { isReady, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "en";

  useEffect(() => {
    if (!isReady) return;

    // 🔐 Not authenticated → login
    if (!isAuthenticated) {
      router.replace(withLocale(locale, "/login"));
      return;
    }

    // 🔒 Authenticated but not authorized → home
    if (roles && user && !roles.includes(user.role)) {
      router.replace(withLocale(locale, "/"));
    }
  }, [isReady, isAuthenticated, user, roles, locale, router]);

  /* =========================
     RENDER GUARD
  ========================= */

  if (!isReady) return null;

  if (!isAuthenticated) return null;

  if (roles && user && !roles.includes(user.role)) return null;

  return <>{children}</>;
}