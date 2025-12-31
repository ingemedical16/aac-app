"use client";

import { useEffect } from "react";
import styles from "./MobileMenu.module.scss";
import { useTranslation } from "react-i18next";

import { useUserProfile } from "@/context/UserProfileContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";

import type { Category } from "@/types/category";
import type { Group } from "@/types/group";

interface Props {
  open: boolean;
  onClose: () => void;

  categories: Category[];
  groups: Group[];

  activeCategory: string;
  activeGroup: string | null;

  onSelectCategory: (id: string) => void;
  onSelectGroup: (id: string | null) => void;
}

export default function MobileMenu({
  open,
  onClose,
  categories,
  groups,
  activeCategory,
  activeGroup,
  onSelectCategory,
  onSelectGroup,
}: Props) {
  const { t } = useTranslation();
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();

  /* =========================
     Scroll lock + ESC
  ========================= */
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("menu")}
    >
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.topRow}>
          <div className={styles.title}>{t("menu")}</div>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        {/* GLOBAL CONTROLS */}
        <LanguageSwitcher />
        <ProfileSwitcher />

        {/* STEP 1: CATEGORY */}
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
          isMobile
        />

        {/* STEP 2: GROUP / SUBCATEGORY */}
        {groups.length > 0 && (
          <SubcategoryBar
            groups={groups}
            activeGroup={activeGroup}
            onSelect={onSelectGroup}
            isMobile
          />
        )}

        {/* ACCESSIBILITY */}
        <div className={styles.section}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggleHighContrast}
            aria-pressed={profile.settings.highContrast}
          >
            {profile.settings.highContrast
              ? t("normalMode")
              : t("highContrast")}
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggleBigButtons}
            aria-pressed={profile.settings.bigButtons}
          >
            {profile.settings.bigButtons
              ? t("normalButtons")
              : t("bigButtons")}
          </button>
        </div>
      </div>
    </div>
  );
}
