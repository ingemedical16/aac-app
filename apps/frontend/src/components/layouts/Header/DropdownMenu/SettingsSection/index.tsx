"use client";

import styles from "./SettingsSection.module.scss";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

import { LanguageSwitcher } from "./LanguageSwitcher";
import AppearanceSettings from "./AppearanceSettings";

type SettingsSectionProps = {
  onAnyAction: () => void;
};

export default function SettingsSection({ onAnyAction }: SettingsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        {t(tx("common", "settings.title"))}
      </div>

      {/* =========================
         LANGUAGE
      ========================= */}
      <div className={styles.inlineControl}>
        <LanguageSwitcher />
      </div>

      {/* =========================
         APPEARANCE (Theme / HC / Big)
      ========================= */}
      <AppearanceSettings onAnyAction={onAnyAction} />
    </div>
  );
}