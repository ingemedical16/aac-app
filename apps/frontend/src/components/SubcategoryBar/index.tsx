"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import { useHighContrast } from "@/context/HighContrastContext";

interface Props {
  locale: string;
  groups?: string[];              // ✅ optional (defensive)
  activeGroup: string | null;
  onSelect: (group: string | null) => void;
}

export default function SubcategoryBar({
  groups = [],                    // ✅ default value prevents crash
  activeGroup,
  onSelect,
}: Props) {
  const { t } = useTranslation("common");
   const { highContrast } = useHighContrast();

  if (groups.length === 0) return null;

  return (
    <nav className={`${styles.subcategoryBar} ${highContrast ? styles.highContrast : ""}`}>
      {/* ALL */}
      <button
        type="button"
        className={
          activeGroup === null
            ? `${styles.item} ${styles.active}`
            : styles.item
        }
        onClick={() => onSelect(null)}
      >
        {t("all")}
      </button>

      {groups.map((groupKey) => (
        <button
          key={groupKey}
          type="button"
          className={
            activeGroup === groupKey
              ? `${styles.item} ${styles.active}`
              : styles.item
          }
          onClick={() => onSelect(groupKey)}
        >
          {t(`groups.${groupKey}`, { defaultValue: groupKey })}
        </button>
      ))}
    </nav>
  );
}
