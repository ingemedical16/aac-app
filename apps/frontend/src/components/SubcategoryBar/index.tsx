"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";

interface Props {
  locale: string;
  groups?: string[];
  activeGroup: string | null;
  onSelect: (group: string | null) => void;
}

export default function SubcategoryBar({
  groups = [],
  activeGroup,
  onSelect,
}: Props) {
  const { t } = useTranslation("common");
  const { profile } = useUserProfile();

  if (!groups.length) return null;

  return (
   
    <nav className={`aac-row ${styles.subcategoryBar} ${profile.highContrast ? styles.highContrast : ""}`}>
      <button
        className={activeGroup === null ? `${styles.item} ${styles.active}` : styles.item}
        onClick={() => onSelect(null)}
      >
        {t("all")}
      </button>

      {groups.map((g) => (
        <button
          key={g}
          className={activeGroup === g ? `${styles.item} ${styles.active}` : styles.item}
          onClick={() => onSelect(g)}
        >
          {t(`groups.${g}`, { defaultValue: g })}
        </button>
      ))}
    </nav>
    
  );
}
