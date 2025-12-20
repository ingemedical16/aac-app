"use client";

import styles from "./CategoryBar.module.scss";
import { CATEGORIES, type Category } from "./categories";

interface Props {
  locale: "en" | "fr" | "ar" | "ro";
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryBar({
  locale,
  activeCategory,
  onSelect,
}: Props) {
  return (
    <nav className={styles.bar}>
      {CATEGORIES.map((cat: Category) => {
        const isActive = cat.id === activeCategory;

        return (
          <button
            key={cat.id}
            type="button"
            className={isActive ? styles.buttonActive : styles.button}
            onClick={() => onSelect(cat.id)}
          >
            <span className={styles.icon}>{cat.icon}</span>

            {/* ✅ FIX: select label by locale */}
            <span className={styles.label}>
              {cat.label[locale]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
