"use client";

import { useState } from "react";
import styles from "./AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import { CATEGORIES } from "@/components/CategoryBar/categories";

export default function AppHeader() {
  const { t } = useTranslation("common");
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(true)}
          aria-label={t("openMenu")}
        >
          ☰
        </button>
      </header>

      {/* DESKTOP HEADER */}
      <header className={styles.header}>
        <div className={styles.left}>
          <LanguageSwitcher />
        </div>

        <div className={styles.center}>
          <h1>{t("appTitleShort")}</h1>
        </div>

        <div className={styles.right}>
          <button
            className={`${styles.btn} ${profile.highContrast ? styles.active : ""}`}
            onClick={toggleHighContrast}
          >
            {profile.highContrast ? t("highContrast") : t("normalMode")}
          </button>

          <button
            className={`${styles.btn} ${profile.bigButtons ? styles.active : ""}`}
            onClick={toggleBigButtons}
          >
            {t("bigButtons")}
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={CATEGORIES}
      />
    </>
  );
}
