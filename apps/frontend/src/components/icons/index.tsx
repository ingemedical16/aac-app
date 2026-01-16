import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  ClipboardList,
  LogIn,
  UserPlus,
  Mail,
  Info,
  HelpCircle,
  FileText,
  ScrollText,
  Shield,
  Stethoscope,
  LogOut,
} from "lucide-react";

/**
 * All sidebar / header icons live here
 * Icons are COMPONENTS (not JSX)
 */
export const NavIcons: Record<
  string,
  ComponentType<LucideProps>
> = {
  /* ===== Public ===== */
  home: Home,
  about: Info,
  contact: Mail,
  help: HelpCircle,
  privacy: FileText,
  terms: ScrollText,

  /* ===== Board ===== */
  board: ClipboardList,

  /* ===== Dashboard ===== */
  dashboard: LayoutDashboard,
  profiles: Users,
  settings: Settings,

  /* ===== Auth ===== */
  login: LogIn,
  register: UserPlus,
  logout: LogOut,

  /* ===== Roles ===== */
  admin: Shield,
  professional: Stethoscope,
};

export type NavIconName = keyof typeof NavIcons;

/**
 * Safe icon renderer
 */
export function renderNavIcon(
  name?: NavIconName,
  size = 18
): JSX.Element | null {
  if (!name) return null;

  const Icon = NavIcons[name];
  if (!Icon) return null;

  return <Icon size={size} aria-hidden />;
}