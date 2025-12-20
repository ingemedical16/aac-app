"use client";

import styles from "./MobileMenu.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Category } from "@/components/CategoryBar/categories";

interface Props {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

export default function MobileMenu({ open, onClose, categories }: Props) {
  const { t } = useTranslation("common");
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <LanguageSwitcher />

        <h3>{t("groups.all")}</h3>

        {categories.map((cat) => (
          <button key={cat.id}>
            {cat.icon} {cat.label.en}
          </button>
        ))}

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
