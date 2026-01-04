"use client";

import styles from "./CategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";
import type { Category } from "@/types/category";
import { tx } from "@/lib/i18n/tx";

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
  const { t } = useTranslation(); // ✅ no namespace here
    useCurrentLanguage(); // 🔥 THIS IS THE FIX

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
          <span className={styles.label}>
            {t(tx("categories", cat.translateKey))}
          </span>
        </button>
      ))}
    </nav>
  );
}