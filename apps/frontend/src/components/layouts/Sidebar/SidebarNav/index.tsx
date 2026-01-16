"use client";

import styles from "./SidebarNav.module.scss";
import type { SidebarNavList } from "@/types/sidebar";

import SidebarNavGroup from "./SidebarNavGroup";

type SidebarNavProps = {
  navList: SidebarNavList;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function SidebarNav({
  navList,
  collapsed = false,
  onNavigate,
}: SidebarNavProps) {
  if (!navList.length) return null;

  return (
    <nav
      className={styles.nav}
      aria-label="Sidebar navigation"
    >
      {navList.map((group) => (
        <SidebarNavGroup
          key={group.key}
          group={group}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}