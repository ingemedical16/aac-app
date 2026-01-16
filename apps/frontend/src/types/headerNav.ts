// src/types/headerNav.ts
import type { UserRole } from "@/types/auth";
import { ViewMode } from "@/types/viewMode";

export type HeaderNavItem = {
  key: string;
  labelKey: string;
  href: string;
  roles?: UserRole[];
  requiresAuth?: boolean;
  /** hide when active profile is CHILD */
  hideForChildProfile?: boolean;
};

export type HeaderNavList = HeaderNavItem[];