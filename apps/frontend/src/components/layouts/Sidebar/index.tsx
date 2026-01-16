"use client";

import styles from "./Sidebar.module.scss";
import { ViewMode } from "@/types/viewMode";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import SidebarHeader from "./SidebarHeader/SidebarHeader";
import SidebarNav from "./SidebarNav/SidebarNav";
import SidebarProfileSection from "./SidebarProfileSection/SidebarProfileSection";
import SidebarFooter from "./SidebarFooter/SidebarFooter";
import CollapseToggle from "./CollapseToggle/CollapseToggle";

type SidebarProps = {
  viewMode: ViewMode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ viewMode, isOpen, onClose }: SidebarProps) {
  const isTabletLandscapeUp = useMediaQuery("(min-width: 820px)");

  /* =========================
     Tablet landscape + desktop
     → Only DASHBOARD has sidebar
  ========================= */
  if (isTabletLandscapeUp && viewMode !== ViewMode.DASHBOARD) {
    return null;
  }

  if (isTabletLandscapeUp && viewMode === ViewMode.DASHBOARD) {
    return (
      <aside className={`${styles.sidebar} ${styles.fixed}`}>
        <SidebarHeader />
        <SidebarNav viewMode={viewMode} />
        <SidebarProfileSection />
        <SidebarFooter />
        <CollapseToggle />
      </aside>
    );
  }

  /* =========================
     Mobile & tablet portrait
     → Overlay drawer (ALL views)
  ========================= */
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <aside className={`${styles.sidebar} ${styles.overlay}`}>
        <SidebarHeader onClose={onClose} />
        <SidebarNav viewMode={viewMode} onNavigate={onClose} />
        <SidebarProfileSection />
        <SidebarFooter />
      </aside>
    </>
  );
}