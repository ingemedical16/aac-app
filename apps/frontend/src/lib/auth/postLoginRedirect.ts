// src/lib/auth/postLoginRedirect.ts

import type { UserRole } from "@/types/auth";

/**
 * 🔀 Decide where user goes AFTER authentication
 *
 * Rules:
 * - Dashboards are role-based
 * - AAC Board is NOT a dashboard
 * - Board access happens FROM dashboards
 */
export function getPostLoginRedirect(
  locale: string,
  role: UserRole,
  next?: string | null
): string {
  // Explicit redirect always wins (e.g. protected routes)
  if (next) return next;

  switch (role) {
    case "ADMIN":
      return `/${locale}/admin`;

    case "PROFESSIONAL":
      return `/${locale}/professional/dashboard`;

    case "PATIENT":
      return `/${locale}/patient/dashboard`;

    default:
      return `/${locale}`;
  }
}