"use client";

import { useEffect, useState } from "react";
import styles from "./AppShell.module.scss";
import { Header } from "../Header";
import { AsideMenu } from "../AsideMenu";
import { MenuButton } from "../MenuButton";

export type AsidePolicy = "always-open" | "always-closed";

type Props = {
  children: React.ReactNode;
  asidePolicy: AsidePolicy;
};

export function AppShell({ children, asidePolicy }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 820);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setMenuOpen(asidePolicy === "always-open");
    } else {
      setMenuOpen(false);
    }
  }, [asidePolicy, isDesktop]);

  const layoutClass = !isDesktop
    ? styles.layoutMobile
    : !menuOpen
    ? styles.layoutAsideClosed
    : collapsed
    ? styles.layoutAsideCollapsed
    : styles.layoutAsideOpen;

  return (
    <div className={`${styles.shell} ${layoutClass}`}>
      {isDesktop && <Header />}

      {!isDesktop && !menuOpen && (
        <MenuButton onClick={() => setMenuOpen(true)} />
      )}

      <AsideMenu
        isOpen={menuOpen}
        isMobile={!isDesktop}
        onClose={() => setMenuOpen(false)}
        onCollapseChange={setCollapsed}   // ✅ safe now
      />

      <main className={styles.main}>{children}</main>
    </div>
  );
}
