"use client";

import styles from "./MobileMenuButton.module.scss";

type MobileMenuButtonProps = {
  onClick: () => void;
};

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Open menu"
      onClick={onClick}
    >
      ☰
    </button>
  );
}