"use client";

import styles from "./SidebarHeader.module.scss";
import Logo from "@/components/layouts/Logo";
import CollapseToggle from "../CollapseToggle";

type SidebarHeaderProps = {
  isOverlay?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
};

export default function SidebarHeader({
  isOverlay = false,
  collapsed = false,
  onClose,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Logo variant={collapsed ? "compact" : "full"} />
      </div>

      <div className={styles.right}>
        {isOverlay && onClose && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}

        {!isOverlay && onToggleCollapse && (
          <CollapseToggle
            collapsed={collapsed}
            onToggle={onToggleCollapse}
          />
        )}
      </div>
    </div>
  );
}