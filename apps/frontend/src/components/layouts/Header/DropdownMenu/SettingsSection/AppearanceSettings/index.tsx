"use client";

import styles from "./AppearanceSettings.module.scss";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";
import { ThemeName } from "@/data/themes";

type AppearanceSettingsProps = {
  onAnyAction: () => void;
};

export default function AppearanceSettings({
  onAnyAction,
}: AppearanceSettingsProps) {
  const { t } = useTranslation();

  const {
    theme,
    setTheme,
    availableThemes,
    highContrast,
    bigButtons,
    toggleHighContrast,
    toggleBigButtons,
  } = useTheme();

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        {t(tx("common", "settings.title"))}
      </div>

      {/* =========================
         THEME SELECT (LIKE LANGUAGE)
      ========================= */}
      <div className={styles.field}>
        <label className={styles.label}>
          {t(tx("common", "appearance.theme"))}
        </label>

        <select
          className={styles.select}
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value as ThemeName);
            onAnyAction();
          }}
          aria-label={t(tx("common", "appearance.theme"))}
        >
          {availableThemes.map((th) => (
            <option key={th.key} value={th.key}>
              {t(th.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* =========================
         ACCESSIBILITY TOGGLES
      ========================= */}
      <div className={styles.toggles}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            toggleHighContrast();
            onAnyAction();
          }}
        >
          {t(tx("common", "settings.highContrast"))}
          <span>{highContrast ? t(tx("common", "settings.on")) : t(tx("common", "settings.off"))}</span>
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            toggleBigButtons();
            onAnyAction();
          }}
        >
          {t(tx("common", "settings.bigButtons"))}
          <span>{bigButtons ? t(tx("common", "settings.on")) : t(tx("common", "settings.off"))}</span>
        </button>
      </div>
    </div>
  );
}