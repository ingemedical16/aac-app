import { NavIconName } from "@/components/icons";
import type { UserRole } from "@/types/auth";
import type { ViewMode } from "@/types/viewMode";


export type SidebarNavItem = {
  key: string;
  labelKey: string;
  href: string;
  icon?: NavIconName; // ✅ string, not JSX
  roles?: UserRole[];
  disabled?: boolean;
};

export type SidebarNavGroup = {
  key: string;
  viewModes: ViewMode[];
  titleKey?: string;
  items: SidebarNavItem[];
};

export type SidebarNavList = SidebarNavGroup[];