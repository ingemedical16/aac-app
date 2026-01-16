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
  Shield,
  Stethoscope,
  HelpCircle,
} from "lucide-react";

/**
 * All sidebar / header icons live here
 * Icons are COMPONENTS (not JSX)
 */
export const NavIcons = {
  home: Home,
  dashboard: LayoutDashboard,
  profiles: Users,
  settings: Settings,
  board: ClipboardList,

  login: LogIn,
  register: UserPlus,
  contact: Mail,
  about: Info,
  help: HelpCircle,

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
): React.ReactNode {
  if (!name) return null;

  const Icon = NavIcons[name];
  if (!Icon) return null;

  return <Icon size={size} aria-hidden />;
}