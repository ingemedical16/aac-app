"use client";

import { useState } from "react";
import styles from "./AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props {
  onOpenMenu: () => void;
}

export default function AppHeader({ onOpenMenu }: Props) {
  const { t } = useTranslation("common");
  const { profile, toggleHighContrast, toggleBigButtons } = useUserProfile();

  return (
    <>
      {/* MOBILE HEADER */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.menuBtn}
          onClick={onOpenMenu}
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
            {profile.highContrast ? t("normalMode") : t("highContrast")}
          </button>

          <button
            className={`${styles.btn} ${profile.bigButtons ? styles.active : ""}`}
            onClick={toggleBigButtons}
          >
            {profile.bigButtons ? t("normalButtons") : t("bigButtons")}
          </button>
        </div>
      </header>
    </>
  );
}
