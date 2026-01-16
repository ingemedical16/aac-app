"use client";

import styles from "./SidebarNav.module.scss";
import { usePathname } from "next/navigation";
import type { SidebarNavList } from "@/types/sidebar";
import SidebarNavGroup from "./SidebarNavGroup";

type SidebarNavProps = {
  navList: SidebarNavList;
  collapsed: boolean;
  onNavigate: () => void;
};

export default function SidebarNav({
  navList,
  collapsed,
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Sidebar navigation">
      {navList.map((group) => (
        <SidebarNavGroup
          key={group.key}
          group={group}
          collapsed={collapsed}
          activePath={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}