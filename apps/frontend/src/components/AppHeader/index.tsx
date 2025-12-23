"use client";

import styles from "./AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import ProfileMenu from "@/components/ProfileMenu";

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
          <ProfileSwitcher />
        </div>

        <div className={styles.center}>
          <h1>{t("appTitleShort")}</h1>
        </div>

        <div className={styles.right}>
          <ProfileMenu />
          <div className={styles.desktopOnly}>
           <button
              className={`${styles.btn} ${profile.settings.highContrast ? styles.active : ""}`}
              onClick={toggleHighContrast}
              aria-pressed={profile.settings.highContrast}
            >
              {profile.settings.highContrast ? t("normalMode") : t("highContrast")}
            </button>

            <button
              className={`${styles.btn} ${profile.settings.bigButtons ? styles.active : ""}`}
              onClick={toggleBigButtons}
            >
              {profile.settings.bigButtons ? t("normalButtons") : t("bigButtons")}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
