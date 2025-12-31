"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import type { Group } from "@/types/group";

interface Props {
  groups: Group[];
  activeGroup: string | null;
  onSelect: (id: string | null) => void;
  isMobile?: boolean;
}

export default function SubcategoryBar({
  groups,
  activeGroup,
  onSelect,
  isMobile = false,
}: Props) {
  const { t } = useTranslation("groups");

  if (!groups.length) return null;

  return (
    <nav className={`${styles.bar} ${isMobile ? styles.mobile : ""}`}>
      {/* ALL */}
      <button
        type="button"
        className={`${styles.button} ${
          activeGroup === null ? styles.buttonActive : ""
        }`}
        onClick={() => onSelect(null)}
      >
        {t("all")}
      </button>

      {/* GROUPS */}
      {groups.map((group) => {
        console.log(group.translateKey, t(group.translateKey));
        console.log("activeGroup", group);
        return (
        <button
          key={group.id}
          type="button"
          className={`${styles.button} ${
            group.id === activeGroup ? styles.buttonActive : ""
          }`}
          onClick={() => onSelect(group.id)}
        >
          {t(group)}
        </button>
      )
    
    
      })}
    </nav>
  );
}
