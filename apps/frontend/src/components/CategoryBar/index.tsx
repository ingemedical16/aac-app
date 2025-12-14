"use client";

import styles from "./CategoryBar.module.scss";
import { CATEGORIES } from "./categories";
import { useUserProfile } from "@/context/UserProfileContext";

interface Props {
  locale: string;
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryBar({ locale, activeCategory, onSelect }: Props) {
  const { profile } = useUserProfile();

  return (
   
    <div
      className={`aac-row ${styles.bar} ${profile.highContrast ? styles.highContrast : ""}`}
      style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={cat.id === activeCategory ? styles.buttonActive : styles.button}
          onClick={() => onSelect(cat.id)}
        >
          <span className={styles.icon}>{cat.icon}</span>
          <span className={styles.label}>
            {cat.label[locale] ?? cat.label.en}
          </span>
        </button>
      ))}
    </div>
    
  );
}
