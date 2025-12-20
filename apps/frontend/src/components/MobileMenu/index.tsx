"use client";

import styles from "./MobileMenu.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import { Category } from "@/components/CategoryBar/categories";

interface Props {
  open: boolean;
  onClose: () => void;
  locale: "en" | "fr" | "ar" | "ro";

  categories: Category[];
  groups: string[];

  activeCategory: string;
  activeGroup: string | null;

  onSelectCategory: (id: string) => void;
  onSelectGroup: (id: string | null) => void;
}

export default function MobileMenu({
  open,
  onClose,
  locale,
  categories,
  groups,
  activeCategory,
  activeGroup,
  onSelectCategory,
  onSelectGroup,
}: Props) {
  const { t } = useTranslation("common");
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <LanguageSwitcher />

        {/* STEP 1: CATEGORY */}
        <CategoryBar
          locale={locale}
          activeCategory={activeCategory}
          onSelect={onSelectCategory}
          isMobile
        />

        {/* STEP 2: SUBCATEGORY */}
        {groups.length > 0 && (
          <SubcategoryBar
            locale={locale}
            groups={groups}
            activeGroup={activeGroup}
            onSelect={onSelectGroup}
            isMobile
          />
        )}

        {/* ACCESSIBILITY */}
        <button onClick={toggleHighContrast}>
          {profile.highContrast ? t("normalMode") : t("highContrast")}
        </button>

        <button onClick={toggleBigButtons}>{t("bigButtons")}</button>

        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
