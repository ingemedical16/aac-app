"use client";

import { useEffect, useState } from "react";
import styles from "./AppShell.module.scss";
import { ViewMode } from "@/types/viewMode";
import Header from "@/components/layouts/Header";
import Aside from "@/components/layouts/Aside";

interface AppShellProps {
  children: React.ReactNode;
  viewMode: ViewMode;
}

export default function AppShell({ children, viewMode }: AppShellProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);

  /* =========================
     DETECT MOBILE
  ========================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* =========================
     RULES
  ========================= */

  const showHeader = !isMobile;
  const showAside =
    viewMode === ViewMode.DASHBOARD && (!isMobile || asideOpen);

  const showBurger = isMobile;

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.shell}>
      {/* Header (desktop only) */}
      {showHeader && (
        <Header
          viewMode={viewMode}
          onBurgerClick={() => setAsideOpen(true)}
        />
      )}

      {/* Aside */}
      {showAside && (
        <Aside
          viewMode={viewMode}
          onClose={() => setAsideOpen(false)}
          isMobile={isMobile}
        />
      )}

      {/* Mobile burger button */}
      {showBurger && (
        <button
          className={styles.mobileBurger}
          onClick={() => setAsideOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      {/* Main content */}
      <main className={styles.main}>{children}</main>

      {/* Mobile overlay */}
      {isMobile && asideOpen && (
        <div
          className={styles.overlay}
          onClick={() => setAsideOpen(false)}
        />
      )}
    </div>
  );
}