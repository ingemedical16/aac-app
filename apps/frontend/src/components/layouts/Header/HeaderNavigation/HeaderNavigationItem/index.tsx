"use client";

import styles from "./HeaderNavigationItem.module.scss";

type HeaderNavigationItemProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function HeaderNavigationItem({
  label,
  onClick,
  disabled = false,
}: HeaderNavigationItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {label}
    </button>
  );
}