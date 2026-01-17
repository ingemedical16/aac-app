"use client";

import styles from "./Sidebar.module.scss";

import { ViewMode } from "@/types/viewMode";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarProfileSection from "./SidebarProfileSection";
import SidebarFooter from "./SidebarFooter";
import CollapseToggle from "./CollapseToggle";

type SidebarProps = {
  viewMode: ViewMode;
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

import { getSidebarNavList } from "@/data/sidebarNavList";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ viewMode, isOpen, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const isTabletLandscapeUp = useMediaQuery("(min-width: 820px)");
  const { user } = useAuth();

  const navList = getSidebarNavList({
    viewMode,
    role: user?.role,
  });

  /* Tablet landscape+ */
  if (isTabletLandscapeUp && viewMode !== ViewMode.DASHBOARD) {
    return null;
  }

  if (isTabletLandscapeUp && viewMode === ViewMode.DASHBOARD) {
    return (
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <SidebarHeader collapsed={collapsed} />

        <SidebarNav
          navList={navList}
          collapsed={collapsed}
          onNavigate={() => {}}
          
        />

        <SidebarProfileSection collapsed={collapsed} />

        <SidebarFooter collapsed={collapsed} />

        <CollapseToggle
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
      </aside>
    );
  }

  /* Mobile / Tablet portrait */
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <aside className={`${styles.sidebar} ${styles.overlay}`}>
        <SidebarHeader onClose={onClose} />

        <SidebarNav
          navList={navList}
          collapsed={false}
          onNavigate={onClose}
        />

        <SidebarProfileSection />

        <SidebarFooter onLogout={onClose} />
      </aside>
    </>
  );
}