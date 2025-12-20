"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  locale: "en" | "fr" | "ar" | "ro";
  groups: string[];
  activeGroup: string | null;
  onSelect: (id: string | null) => void;
  isMobile?: boolean;
}

export default function SubcategoryBar({
  locale,
  groups,
  activeGroup,
  onSelect,
  isMobile = false,
}: Props) {
  if (!groups.length) return null;
  const { t } = useTranslation("common");

  return (
    <nav className={`${styles.bar} ${isMobile ? styles.mobile : ""}`}>
      <button
        className={`${styles.button} ${activeGroup === null ? styles.buttonActive : ""}`}
        onClick={() => onSelect(null)}
      >
       { t("all")}
      </button>

      {groups.map((g) => (
        <button
          key={g}
          className={`${styles.button} ${g === activeGroup ? styles.buttonActive : ""}`}
          onClick={() => onSelect(g)}
        >
         {t(`groups.${g}`)}
        </button>
      ))}
    </nav>
  );
}
