"use client";

import styles from "./Aside.module.scss";
import { ViewMode } from "@/types/viewMode";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import AsideHeader from "./AsideHeader";
import AsideNav from "./AsideNav";
import AsideProfileSection from "./AsideProfileSection";
import AsideFooter from "./AsideFooter";
import CollapseToggle from "./CollapseToggle";

type AsideProps = {
  viewMode: ViewMode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Aside({ viewMode, isOpen, onClose }: AsideProps) {
  const isTabletLandscapeUp = useMediaQuery("(min-width: 820px)");

  /**
   * Tablet Landscape+ behavior
   * - Only dashboard has a visible aside
   */
  if (isTabletLandscapeUp && viewMode !== ViewMode.DASHBOARD) {
    return null;
  }

  /**
   * Desktop / Tablet Landscape → fixed aside
   */
  if (isTabletLandscapeUp && viewMode === ViewMode.DASHBOARD) {
    return (
      <aside className={`${styles.aside} ${styles.fixed}`}>
        <AsideHeader />

        <AsideNav />

        <AsideProfileSection />

        <AsideFooter />

        <CollapseToggle />
      </aside>
    );
  }

  /**
   * Mobile & Tablet Portrait → overlay drawer
   * Same behavior for ALL views
   */
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <aside className={`${styles.aside} ${styles.overlay}`}>
        <AsideHeader onClose={onClose} />

        <AsideNav onNavigate={onClose} />

        <AsideProfileSection />

        <AsideFooter />
      </aside>
    </>
  );
}