"use client";

import styles from "./SubcategoryBar.module.scss";
import { useTranslation } from "react-i18next";
import type { Group } from "@/types/group";
import { tx } from "@/lib/i18n/tx";

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
  const { t } = useTranslation(); // ✅ NO namespace here

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
        {t(tx("groups", "all"))}
      </button>

      {/* GROUPS */}
      {groups.map((group) => (
        <button
          key={group.id}
          type="button"
          className={`${styles.button} ${
            group.id === activeGroup ? styles.buttonActive : ""
          }`}
          onClick={() => onSelect(group.id)}
        >
          {t(tx("groups", group.translateKey))}
        </button>
      ))}
    </nav>
  );
}