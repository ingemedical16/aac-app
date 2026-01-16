"use client";

import styles from "./SidebarNavItem.module.scss";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import type { SidebarNavItem as SidebarNavItemType } from "@/types/sidebar";
import { renderNavIcon } from "@/components/icons";


type Props = {
  item: SidebarNavItemType;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function SidebarNavItem({
  item,
  collapsed = false,
  onNavigate,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);

  const handleClick = () => {
    if (item.disabled) return;
    router.push(item.href);
    onNavigate?.();
  };

  return (
    <button
      type="button"
      className={[
        styles.item,
        isActive ? styles.active : "",
        item.disabled ? styles.disabled : "",
        collapsed ? styles.collapsed : "",
      ].join(" ")}
      onClick={handleClick}
      disabled={item.disabled}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={item.disabled || undefined}
    >
      {item.icon && (
        <span className={styles.icon}>
          {renderNavIcon(item.icon)}
        </span>
      )}

      {!collapsed && (
        <span className={styles.label}>
          {t(item.labelKey)}
        </span>
      )}
    </button>
  );
}