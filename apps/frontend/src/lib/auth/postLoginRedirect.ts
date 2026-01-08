import type { UserRole } from "@/types/auth";

export function getPostLoginRedirect(
  role: UserRole,
  next?: string | null
): string {
  if (next) return next;

  switch (role) {
    case "USER":
      return "/patient/dashboard";

    case "PROFESSIONAL":
      return "/professional/dashboard";

    case "ADMIN":
      return "/admin";

    default:
      return "/";
  }
}