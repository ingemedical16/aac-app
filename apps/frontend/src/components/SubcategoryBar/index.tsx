"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  locale: string;
  groups: string[];             // list of semantic group keys, e.g. ["mealBasics", "freshSnacks"]
  activeGroup: string | null;
  onSelect: (group: string | null) => void;
}

export default function SubcategoryBar({
  locale,  // kept for future tuning if needed
  groups,
  activeGroup,
  onSelect,
}: Props) {
  const { t } = useTranslation("common");

  if (!groups.length) return null;

  return (
    <nav className={styles.subcategoryBar}>
      {/* "All" button */}
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

      {groups.map((groupKey) => {
        const label =
          t(`groups.${groupKey}`, {
            defaultValue: groupKey, // fallback if translation missing
          });

        return (
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
            {label}
          </button>
        );
      })}
    </nav>
  );
}
