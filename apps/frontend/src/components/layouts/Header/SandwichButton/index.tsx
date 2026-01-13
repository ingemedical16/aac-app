"use client";

import styles from "./SandwichButton.module.scss";

type SandwichButtonProps = {
  onClick?: () => void;
};

export default function SandwichButton({ onClick }: SandwichButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Open menu"
      onClick={onClick}
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
}