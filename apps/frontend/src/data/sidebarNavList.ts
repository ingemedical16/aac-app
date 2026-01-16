import { ViewMode } from "@/types/viewMode";
import type { UserRole } from "@/types/auth";
import type { SidebarNavList, SidebarNavGroup } from "@/types/sidebar";

/* =====================================================
   RAW NAV DATA (NO LOGIC)
===================================================== */

export const sidebarNavList: SidebarNavList = [
  {
    key: "public",
    viewModes: [ViewMode.PUBLIC],
    items: [
      {
        key: "home",
        labelKey: "nav.home",
        href: "/",
        icon: "home",
      },
      {
        key: "about",
        labelKey: "nav.about",
        href: "/about",
        icon: "about",
      },
      {
        key: "contact",
        labelKey: "nav.contact",
        href: "/contact",
        icon: "contact",
      },
    ],
  },

  {
    key: "board",
    viewModes: [ViewMode.BOARD],
    items: [
      {
        key: "board",
        labelKey: "nav.board",
        href: "/board",
        icon: "board",
      },
    ],
  },

  {
    key: "dashboard.user",
    viewModes: [ViewMode.DASHBOARD],
    titleKey: "nav.section.account",
    items: [
      {
        key: "dashboard",
        labelKey: "nav.dashboard",
        href: "/dashboard",
        icon: "dashboard",
        roles: ["USER"],
      },
      {
        key: "profiles",
        labelKey: "nav.profiles",
        href: "/dashboard?tab=profiles",
        icon: "profiles",
        roles: ["USER"],
      },
      {
        key: "settings",
        labelKey: "nav.settings",
        href: "/dashboard?tab=settings",
        icon: "settings",
        roles: ["USER"],
      },
    ],
  },

  {
    key: "dashboard.admin",
    viewModes: [ViewMode.DASHBOARD],
    titleKey: "nav.section.admin",
    items: [
      {
        key: "admin",
        labelKey: "nav.adminTools",
        href: "/dashboard?tab=admin",
        icon: "admin",
        roles: ["ADMIN"],
      },
    ],
  },

  {
    key: "dashboard.professional",
    viewModes: [ViewMode.DASHBOARD],
    titleKey: "nav.section.professional",
    items: [
      {
        key: "professional",
        labelKey: "nav.professionalTools",
        href: "/dashboard?tab=professional",
        icon: "professional",
        roles: ["PROFESSIONAL"],
      },
    ],
  },
];

/* =====================================================
   SELECTOR / BUILDER
===================================================== */

/**
 * Returns the effective sidebar navigation based on
 * view mode and user role.
 *
 * - PUBLIC → public nav
 * - BOARD → board nav
 * - DASHBOARD → role-based dashboard nav
 */
export function getSidebarNavList(params: {
  viewMode: ViewMode;
  role?: UserRole;
}): SidebarNavGroup[] {
  const { viewMode, role } = params;

  return sidebarNavList
    .filter((group) => group.viewModes.includes(viewMode))
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        // No role restriction
        if (!item.roles || item.roles.length === 0) return true;

        // Requires authentication + role
        if (!role) return false;

        return item.roles.includes(role);
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
}