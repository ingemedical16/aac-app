"use client";

import React from "react";
import styles from "./AppShell.module.scss";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      {/* HEADER (shared) */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* ☰ menu button placeholder */}
          <button className={styles.menuBtn} aria-label="Open menu">
            ☰
          </button>
        </div>

        <div className={styles.headerCenter}>
          {/* App title / logo placeholder */}
          <span className={styles.logo}>AAC</span>
        </div>

        <div className={styles.headerRight}>
          {/* User / language placeholder */}
        </div>
      </header>

      {/* BODY */}
      <div className={styles.body}>
        {/* ASIDE */}
        <aside className={styles.aside}>
          {/* Navigation placeholder */}
        </aside>

        {/* MAIN */}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}