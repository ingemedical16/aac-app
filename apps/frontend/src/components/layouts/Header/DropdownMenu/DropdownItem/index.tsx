"use client";

import styles from "./DropdownItem.module.scss";

type DropdownItemProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
  rightSlot?: React.ReactNode;
};

export default function DropdownItem({
  label,
  onClick,
  disabled,
  variant = "default",
  rightSlot,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item} ${variant === "danger" ? styles.danger : ""}`}
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      aria-disabled={disabled || undefined}
    >
      <span className={styles.label}>{label}</span>
      {rightSlot ? <span className={styles.right}>{rightSlot}</span> : null}
    </button>
  );
}