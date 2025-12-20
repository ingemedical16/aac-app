"use client";

import styles from "./CategoryBar.module.scss";
import { CATEGORIES } from "./categories";

interface Props {
  locale: "en" | "fr" | "ar" | "ro";
  activeCategory: string;
  onSelect: (id: string) => void;
  isMobile?: boolean;
}

export default function CategoryBar({
  locale,
  activeCategory,
  onSelect,
  isMobile = false,
}: Props) {
  return (
    <nav className={`${styles.bar} ${isMobile ? styles.mobile : ""}`}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={
            cat.id === activeCategory ? styles.buttonActive : styles.button
          }
          onClick={() => onSelect(cat.id)}
        >
          <span className={styles.icon}>{cat.icon}</span>
          <span className={styles.label}>{cat.label[locale]}</span>
        </button>
      ))}
    </nav>
  );
}
