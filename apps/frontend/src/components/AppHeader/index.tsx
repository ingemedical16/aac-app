"use client";

import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./AppHeader.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";

export default function AppHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation("common");

  // ✅ CORRECT API USAGE
  const { profile, toggleHighContrast } = useUserProfile();

  /* -----------------------------
     FULLSCREEN LOGIC
  -------------------------------- */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <header className={styles.header}>
      {/* LEFT */}
      <div className={styles.left}>
        <LanguageSwitcher />
      </div>

      {/* CENTER */}
      <div className={styles.center}>
        <h1>{t("appTitleShort")}</h1>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        {/* HIGH CONTRAST */}
        <button
          className={styles.btn} 
          onClick={toggleHighContrast}
        >
          {profile.highContrast
            ? "* " + t("normalMode")
            : "⚠ " + t("highContrast")}
        </button>

        {/* FULL SCREEN */}
        <button className={styles.btn} onClick={toggleFullscreen}>
          {isFullscreen
            ? "⤢ " + t("exitFullscreen")
            : "⛶ " + t("enterFullscreen")}
        </button>
      </div>
    </header>
  );
}
