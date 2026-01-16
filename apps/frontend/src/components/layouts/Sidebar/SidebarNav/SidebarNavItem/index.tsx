"use client";

import { renderNavIcon } from "@/components/icons";
import { NavIconName } from "@/components/icons";
import styles from "./SidebarNavItem.module.scss";


type SidebarNavItemProps = {
  label: string;
  icon?: NavIconName;
  active?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  onClick: () => void;
};

export default function SidebarNavItem({
  label,
  icon,
  active,
  disabled,
  collapsed,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      className={[
        styles.item,
        active ? styles.active : "",
        disabled ? styles.disabled : "",
        collapsed ? styles.collapsed : "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{renderNavIcon(icon)}</span>}
      <span className={styles.label}>{label}</span>
    </button>
  );
}