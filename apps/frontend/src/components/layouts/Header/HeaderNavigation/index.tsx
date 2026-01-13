"use client";

import styles from "./HeaderNavigation.module.scss";
import HeaderNavigationItem from "./HeaderNavigationItem";
import { ViewMode } from "@/types/viewMode";

export type HeaderNavItem = {
  key: string;
  label: string;
  href: string;
};

type HeaderNavigationProps = {
  items: HeaderNavItem[];
  viewMode: ViewMode;
};

export default function HeaderNavigation({
  items,
  viewMode,
}: HeaderNavigationProps) {
  // ❌ Hidden on mobile & tablet portrait
  // ✅ Visible from tablet-landscape and up
  return (
    <nav
      className={styles.nav}
      aria-label="Primary navigation"
      data-view={viewMode}
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <HeaderNavigationItem
            key={item.key}
            label={item.label}
            href={item.href}
          />
        ))}
      </ul>
    </nav>
  );
}