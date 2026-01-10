"use client";

import { useState } from "react";
import styles from "./AppShell.module.scss";

import Header from "@/components/layouts/Header";
import Aside from "@/components/layouts/Aside";
import MobileMenu from "@/components/MobileMenu";

import { ViewMode } from "@/types/viewMode";
import useAutoHideHeader  from "@/hooks/useAutoHideHeader";
import { useIsMobile } from "@/hooks/useIsMobile";

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

const showAside =
  (isMobile && isAsideOpen) ||
  (viewMode === ViewMode.DASHBOARD && !isMobile);

const showMobileToggle = isMobile;

  /* ========================= */

  return (
    <div className={styles.shell} data-view={viewMode}>
      {showHeader && <Header viewMode={viewMode} />}

      {showMobileToggle && (
        <MobileMenu
          isOpen={isAsideOpen}
          onToggle={() => setIsAsideOpen((v) => !v)}
        />
      )}

      <div className={styles.body}>
        {showAside && (
          <Aside
            viewMode={viewMode}
            onNavigate={() => setIsAsideOpen(false)}
          />
        )}

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}