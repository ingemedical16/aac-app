"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";

export interface Subcategory {
  id: string;
  label: {
    en: string;
    fr: string;
    ar: string;
    ro: string;
  };
}

interface Props {
  locale: "en" | "fr" | "ar" | "ro";
  subcategories: Subcategory[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export default function SubcategoryBar({
  locale,
  subcategories,
  activeId,
  onSelect,
}: Props) {
  const { t } = useTranslation("common");

  if (!subcategories?.length) return null;
  

  return (
    <nav className={styles.bar}>
      {/* ALL */}
      <button
        type="button"
        className={`${styles.button} ${
          activeId === null ? styles.buttonActive : ""
        }`}
        onClick={() => onSelect(null)}
      >
        {t("all")}
      </button>

      {subcategories.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`${styles.button} ${
            s.id === activeId ? styles.buttonActive : ""
          }`}
          onClick={() => onSelect(s.id)}
        >
          {s.label[locale]}
        </button>
      ))}
    </nav>
  );
}
