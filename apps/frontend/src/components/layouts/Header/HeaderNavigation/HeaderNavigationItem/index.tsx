"use client";

import styles from "./HeaderNavigationItem.module.scss";

type Props = {
  label: string;
  onClick: () => void;
};

export default function HeaderNavigationItem({ label, onClick }: Props) {
  return (
    <button
      type="button"
      className={styles.item}
      onClick={onClick}
    >
      {label}
    </button>
  );
}