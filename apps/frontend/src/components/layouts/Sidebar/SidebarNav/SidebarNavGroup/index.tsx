"use client";

import styles from "./SidebarNavGroup.module.scss";
import SidebarNavItem from "../SidebarNavItem";

import type { SidebarNavGroup as SidebarNavGroupType } from "@/types/sidebar";

type SidebarNavGroupProps = {
  group: SidebarNavGroupType;
  collapsed?: boolean;
};

export default function SidebarNavGroup({
  group,
  collapsed = false,
}: SidebarNavGroupProps) {
  return (
    <div className={styles.group}>
      {group.titleKey && !collapsed && (
        <div className={styles.title}>
          {/* titleKey is translated in parent (SidebarNav) */}
          {group.titleKey}
        </div>
      )}

      <ul className={styles.list}>
        {group.items.map((item) => (
          <li key={item.key}>
            <SidebarNavItem item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
    </div>
  );
}