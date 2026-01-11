"use client";

import { useState, useEffect } from "react";
import styles from "./AppShell.module.scss";
import { Header } from "../Header";
import { AsideMenu } from "../AsideMenu";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu automatically on desktop resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.shell}>
      {/* Desktop Header */}
      <Header onToggleMenu={() => setMenuOpen(v => !v)} />

      {/* Sidebar / Mobile Overlay */}
      <AsideMenu isOpen={menuOpen} />

      {/* Main Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
