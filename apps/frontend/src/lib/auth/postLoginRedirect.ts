import type { UserRole } from "@/types/auth";

export function getPostLoginRedirect(
  locale: string,
  role: UserRole,
  next?: string | null
): string {
  if (next) return next;

  switch (role) {
    case "PARENT":
      return `/${locale}/parent/dashboard`;

    case "CHILD":
    case "PATIENT_ADULT":
    case "PROFESSIONAL":
      return `/${locale}/board`;

    case "ADMIN":
      return `/${locale}/admin`;

    default:
      return `/${locale}`;
  }
}