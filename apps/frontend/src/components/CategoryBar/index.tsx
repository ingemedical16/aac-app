"use client";

import styles from "./CategoryBar.module.scss";
import { CATEGORIES } from "./categories";

interface Props {
  locale: string;
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryBar({ locale, activeCategory, onSelect }: Props) {
  // Set direction for RTL/LTR support
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={styles.bar}
      style={{ direction: dir }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === activeCategory;

        return (
          <button
            key={cat.id}
            className={isActive ? styles.buttonActive : styles.button}
            onClick={() => onSelect(cat.id)}
          >
            <span className={styles.icon}>{cat.icon}</span>
            <span className={styles.label}>{cat.label[locale] ?? cat.label.en}</span>
          </button>
        );
      })}
    </div>
  );
}
