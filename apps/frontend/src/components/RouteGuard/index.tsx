"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

type Props = {
  locale: string;
  children: React.ReactNode;
};

/**
 * Client-side route guarding (localStorage JWT).
 * - Public routes are always accessible
 * - Protected routes require auth
 * - Role-based restrictions and redirects
 */
export default function RouteGuard({ locale, children }: Props) {
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;
  const { isReady, isAuthenticated, user, logout } = useAuth();
  const { profile } = useUserProfile();

  const routes = useMemo(() => {
    const prefix = `/${locale}`;

    const isUnderLocale = pathname.startsWith(prefix);
    const pathNoLocale = isUnderLocale ? pathname.slice(prefix.length) || "/" : pathname;

    const isPublic =
      pathNoLocale === "/" ||
      pathNoLocale.startsWith("/login") ||
      pathNoLocale.startsWith("/register");

    const isBoard = pathNoLocale === "/board" || pathNoLocale.startsWith("/board/");
    const isParentDashboard =
      pathNoLocale === "/parent/dashboard" || pathNoLocale.startsWith("/parent/dashboard/");

    return {
      prefix,
      pathNoLocale,
      isPublic,
      isBoard,
      isParentDashboard,
    };
  }, [locale, pathname]);

  useEffect(() => {
    if (!isReady) return;

    // PUBLIC routes are always allowed
    if (routes.isPublic) return;

    // Not authenticated -> go login
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`/${locale}/login?next=${next}`);
      return;
    }

    // Authenticated but user missing (edge case) -> reset
    if (!user) {
      logout();
      router.replace(`/${locale}/login`);
      return;
    }

    // Role-based restrictions
    // NOTE: You can extend this matrix as your dashboard pages grow.
    if (user.role === "PARENT") {
      /**
       * Temporary logic until AP-54 “Child Profile Activation”
       * Right now we rely on local AAC profile role as a placeholder signal.
       * In AP-54 we will replace this with “activeChildId” (backend-driven).
       */
      const hasActiveChild =
        profile.role === "child"; // placeholder; AP-54 will replace

      if (routes.isBoard && !hasActiveChild) {
        router.replace(`/${locale}/parent/dashboard`);
        return;
      }
    }

    // CHILD should never land in parent dashboard
    if (user.role === "CHILD" && routes.isParentDashboard) {
      router.replace(`/${locale}/board`);
      return;
    }

    // PROFESSIONAL / PATIENT_ADULT / ADMIN:
    // For now allow board; later you’ll add specific dashboards.
  }, [
    isReady,
    isAuthenticated,
    user,
    locale,
    pathname,
    routes.isPublic,
    routes.isBoard,
    routes.isParentDashboard,
    profile.role,
    router,
    logout,
  ]);

  // Avoid “flash” of protected UI before checks complete
  if (!isReady) return null;

  // If protected and not authenticated, we will redirect; render nothing
  if (!routes.isPublic && !isAuthenticated) return null;

  return <>{children}</>;
}
