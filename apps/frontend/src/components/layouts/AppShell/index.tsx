"use client";

import { ReactNode, useState } from "react";
import styles from "./AppShell.module.scss";
import { ViewMode } from "@/types/viewMode";

/* Shared UI */
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ProfileSwitcher from "@/components/ProfileSwitcher";

/* Icons (replace later if needed) */
function Burger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.burger}
      onClick={onClick}
      aria-label="Open menu"
    >
      ☰
    </button>
  );
}

interface AppShellProps {
  mode: ViewMode;
  children: ReactNode;
}

/**
 * AppShell
 *
 * Layout controller ONLY.
 * - No auth
 * - No roles
 * - No routing logic
 */
export default function AppShell({ mode, children }: AppShellProps) {
  const [asideOpen, setAsideOpen] = useState(false);

  const showHeader = true;
  const showAside = mode === ViewMode.DASHBOARD;

  return (
    <div className={`${styles.shell} ${styles[mode]}`}>
      {/* =========================
         HEADER
      ========================= */}
      {showHeader && (
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {showAside && (
              <Burger onClick={() => setAsideOpen((v) => !v)} />
            )}
            <span className={styles.logo}>AAC</span>
          </div>

          <div className={styles.headerRight}>
            <LanguageSwitcher />
            {mode !== ViewMode.PUBLIC && <ProfileSwitcher />}
          </div>
        </header>
      )}

      {/* =========================
         BODY
      ========================= */}
      <div className={styles.body}>
        {/* =========================
           ASIDE (Dashboard only)
        ========================= */}
        {showAside && (
          <aside
            className={`${styles.aside} ${
              asideOpen ? styles.open : ""
            }`}
          >
            <nav className={styles.nav}>
              <a href="#">Profiles</a>
              <a href="#">Settings</a>
              <a href="#">Security</a>
            </nav>
          </aside>
        )}

        {/* =========================
           MAIN
        ========================= */}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}