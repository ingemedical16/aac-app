"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * AuthGate
 * 🔐 Authentication guard ONLY
 *
 * Responsibilities:
 * - Ensure the user is authenticated
 * - Redirect to /login if not
 *
 * ❌ Does NOT handle:
 * - Roles
 * - Dashboards
 * - Layouts
 * - Profiles
 */
export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  // ⏳ Wait for auth hydration
  if (!isReady) return null;

  // 🚫 Not authenticated → nothing rendered (redirect in effect)
  if (!isAuthenticated) return null;

  // ✅ Authenticated
  return <>{children}</>;
}