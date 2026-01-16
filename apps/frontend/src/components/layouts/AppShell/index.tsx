"use client";

import { useState } from "react";
import styles from "./AppShell.module.scss";

import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import MobileMenu from "@/components/MobileMenu";

import { ViewMode } from "@/types/viewMode";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileMenuButton from "../MobileMenuButton";

interface AppShellProps {
  children: React.ReactNode;
  viewMode: ViewMode;
}

export default function AppShell({ children, viewMode }: AppShellProps) {
  /* =========================
     VISIBILITY RULES (LOCKED)
  ========================= */
  const isMobile = useIsMobile();
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  /* =========================
   VISIBILITY RULES (FINAL)
========================= */

  const showHeader = !isMobile;
  const toggle = (val: boolean) => !val;

  const showAside =
    (isMobile && isAsideOpen) || (viewMode === ViewMode.DASHBOARD && !isMobile);
  console.log("showAside", showAside);

  const showMobileToggle = isMobile;

  /* ========================= */

  return (
    <div className={styles.shell} data-view={viewMode}>
      {showHeader && <Header viewMode={viewMode} />}
      {showMobileToggle && (
        <MobileMenuButton onClick={() => setIsAsideOpen(toggle)} />
      )}

      <div className={styles.body}>
        {showAside && (
          <Sidebar
            viewMode={viewMode}
            onNavigate={() => setIsAsideOpen(false)}
          />
        )}

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
