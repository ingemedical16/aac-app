"use client";

import styles from "./AsideMenu.module.scss";
import { useAsideState } from "../../../hooks/useAsideState";
import { useSwipe } from "../../../hooks/useSwipe";
import { AsideToggle } from "./AsideToggle";
import { NavContainer } from "./NavContainer";

type Props = {
  isOpen: boolean;
};

export function AsideMenu({ isOpen }: Props) {
  const { collapsed, setCollapsed } = useAsideState();
  const swipe = useSwipe(
    () => setCollapsed(true),
    () => setCollapsed(false)
  );

  if (!isOpen) return null;

  return (
    <aside
      className={`${styles.aside} ${collapsed ? styles.collapsed : ""}`}
      tabIndex={0}
      role="navigation"
      aria-label="Main navigation"
      onKeyDown={e => {
        if (e.key === "ArrowLeft") setCollapsed(true);
        if (e.key === "ArrowRight") setCollapsed(false);
      }}
      {...swipe}
    >
      <NavContainer collapsed={collapsed} />

      <AsideToggle
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />
    </aside>
  );
}
