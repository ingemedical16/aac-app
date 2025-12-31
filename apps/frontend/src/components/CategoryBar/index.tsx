"use client";

import styles from "./CategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/category";

interface Props {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
  isMobile?: boolean;
}

export default function CategoryBar({
  categories,
  activeCategory,
  onSelect,
  isMobile = false,
}: Props) {
  const { t } = useTranslation("categories");

  return (
    <nav className={`${styles.bar} ${isMobile ? styles.mobile : ""}`}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={
            cat.id === activeCategory ? styles.buttonActive : styles.button
          }
          onClick={() => onSelect(cat.id)}
        >
          {/* ICON */}
          <span className={styles.icon}>{cat.icon}</span>

          {/* LABEL */}
          <span className={styles.label}>{t(cat.translateKey)}</span>
        </button>
      ))}
    </nav>
  );
}
