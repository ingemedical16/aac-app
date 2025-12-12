"use client";

import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useHighContrast } from "@/context/HighContrastContext";
import styles from "./AppHeader.module.scss";
import { useTranslation } from "react-i18next";

export default function AppHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { highContrast, toggleHighContrast } = useHighContrast();

    const { t } = useTranslation("common");

  /** FULLSCREEN LOGIC */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
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

        {/* HIGH CONTRAST MODE */}
        <button
          className={`${styles.btn} ${highContrast ? styles.active : ""}`}
          onClick={toggleHighContrast}
        >
          {highContrast ? "☀ Normal" : "⚠ High Contrast"}
        </button>

        {/* FULL SCREEN */}
        <button className={styles.btn} onClick={toggleFullscreen}>
          {isFullscreen ? "⤢ Exit Full" : "⛶ Fullscreen"}
        </button>
      </div>
    </header>
  );
}
