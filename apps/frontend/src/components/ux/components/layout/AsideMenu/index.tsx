"use client";

import styles from "./AsideMenu.module.scss";
import { NavContainer } from "./NavContainer";
import { AsideToggle } from "./AsideToggle";
import { useAsideState } from "@/components/ux/hooks/useAsideState";
import { AsideHeader } from "./AsideHeader";
import { AsideFooter } from "./AsideFooter";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  onCollapseChange: (v: boolean) => void;
};

export function AsideMenu({ isOpen, isMobile, onClose, onCollapseChange }: Props) {
  const { collapsed, setCollapsed } = useAsideState();

  // Notify parent AFTER render
  useEffect(() => {
    onCollapseChange(collapsed);
  }, [collapsed, onCollapseChange]);

  if (!isOpen) return null;

  const isCollapsed = !isMobile && collapsed;

  return (
    <aside className={`${styles.aside} ${isCollapsed ? styles.collapsed : ""}`}>
      {isMobile && (
        <button className={styles.close} onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      )}

      <AsideHeader collapsed={isCollapsed} />

      <NavContainer
        collapsed={isCollapsed}
        onItemClick={() => isMobile && onClose()}
      />

      <AsideFooter collapsed={isCollapsed} />

      {!isMobile && (
        <AsideToggle
          collapsed={isCollapsed}
          onToggle={() => setCollapsed(v => !v)}   // ✅ only local state
        />
      )}
    </aside>
  );
}
