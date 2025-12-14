"use client";

import { useEffect } from "react";
import styles from "./MobileMenu.module.scss";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{t("menu")}</h2>

        <LanguageSwitcher />

        <button onClick={toggleHighContrast}>
          {profile.highContrast ? t("normalMode") : t("highContrast")}
        </button>

        <button onClick={toggleBigButtons}>
          {profile.bigButtons ? t("normalButtons") : t("bigButtons")}
        </button>

        <button className={styles.close} onClick={onClose}>
          {t("close")}
        </button>
      </aside>
    </div>
  );
}
