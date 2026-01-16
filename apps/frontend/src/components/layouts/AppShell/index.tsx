"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import styles from "./AppShell.module.scss";

import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";

import { ViewMode } from "@/types/viewMode";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* =====================================================
   VIEW MODE RESOLUTION
===================================================== */

function resolveViewMode(pathname: string): ViewMode {
  if (pathname.startsWith("/dashboard")) return ViewMode.DASHBOARD;
  if (pathname.startsWith("/board")) return ViewMode.BOARD;
  return ViewMode.PUBLIC;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const viewMode = resolveViewMode(pathname);

  const isTabletLandscapeUp = useMediaQuery("(min-width: 820px)");

  /* Sidebar state (mobile / tablet portrait only) */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const onToggleSidebar = () => setSidebarOpen((prev) => !prev);
  const onToggleCollapse = () => setCollapsed((prev) => !prev);

  /* =====================================================
     HEADER VISIBILITY
     - Hidden on mobile & tablet portrait
     - Visible tablet landscape+
  ===================================================== */
  const showHeader = isTabletLandscapeUp;

  /* =====================================================
     LAYOUT
  ===================================================== */

  return (
    <div className={styles.shell} data-view={viewMode}>
      {showHeader && (
        <Header
          viewMode={viewMode}
          isMobile={!isTabletLandscapeUp}
          onToggleSidebar={onToggleSidebar}
        />
      )}

      <div className={styles.main}>
        <Sidebar
          viewMode={viewMode}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          
        />

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}