// src/lib/auth/postLoginRedirect.ts
import type { UserRole } from "@/types/auth";

export function getPostLoginRedirect(
  _locale: string, // kept for API stability, not used
  role: UserRole,
  next?: string | null
): string {
  if (next) return next;

  switch (role) {
    case "ADMIN":
      return "/admin";

    case "PROFESSIONAL":
      return "/professional/dashboard";

    case "PATIENT":
      return "/patient/dashboard";

    default:
      return "/";
  }
}