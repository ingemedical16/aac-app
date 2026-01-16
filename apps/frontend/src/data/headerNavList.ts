// src/data/headerNavList.ts
import { ViewMode } from "@/types/viewMode";
import type { HeaderNavItem, HeaderNavList } from "@/types/headerNav";
import type { UserRole } from "@/types/auth";

type BuildHeaderNavParams = {
  viewMode: ViewMode;
  isAuthenticated: boolean;
  userRole?: UserRole;
  isChildProfile?: boolean;
};

export function buildHeaderNavList({
  viewMode,
  isAuthenticated,
  userRole,
  isChildProfile,
}: BuildHeaderNavParams): HeaderNavList {
  /* =========================
     PUBLIC
  ========================= */
  if (viewMode === ViewMode.PUBLIC) {
    return [
      { key: "home", labelKey: "nav.home", href: "/" },
      { key: "about", labelKey: "nav.about", href: "/about" },
      { key: "contact", labelKey: "nav.contact", href: "/contact" },
      { key: "help", labelKey: "nav.help", href: "/help" },
      { key: "privacy", labelKey: "nav.privacy", href: "/privacy" },
      { key: "terms", labelKey: "nav.terms", href: "/terms" },
    ];
  }

  /* =========================
     BOARD
     - Dashboard link visible only if:
       - authenticated
       - NOT child profile
  ========================= */
  if (viewMode === ViewMode.BOARD) {
    const items: HeaderNavItem[] = [
      {
        key: "board",
        labelKey: "nav.board",
        href: "/board",
      },
    ];

    if (isAuthenticated && !isChildProfile) {
      items.push({
        key: "dashboard",
        labelKey: "nav.dashboard",
        href: "/dashboard",
        requiresAuth: true,
      });
    }

    return items;
  }

  /* =========================
     DASHBOARD
  ========================= */
  if (viewMode === ViewMode.DASHBOARD && isAuthenticated) {
    return [
      {
        key: "dashboard",
        labelKey: "nav.dashboard",
        href: "/dashboard",
        requiresAuth: true,
      },
      {
        key: "profiles",
        labelKey: "nav.profiles",
        href: "/dashboard?tab=profiles",
        requiresAuth: true,
        hideForChildProfile: true,
      },
      {
        key: "settings",
        labelKey: "nav.settings",
        href: "/dashboard?tab=settings",
        requiresAuth: true,
      },
    ];
  }

  return [];
}