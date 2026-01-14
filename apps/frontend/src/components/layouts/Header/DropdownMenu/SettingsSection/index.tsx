"use client";

import styles from "./SettingsSection.module.scss";
import DropdownItem from "../DropdownItem";

import { useUserProfile } from "@/context/UserProfileContext";

import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SettingsSectionProps = {
  onAnyAction: () => void;
};

export default function SettingsSection({ onAnyAction }: SettingsSectionProps) {
  const { t } = useTranslation();
  const { profile, updateProfile } = useUserProfile();

  const toggleHighContrast = () => {
    if (!profile) return;
    updateProfile(profile.id, { highContrast: !profile.highContrast });
    onAnyAction();
  };

  const toggleBigButtons = () => {
    if (!profile) return;
    updateProfile(profile.id, { bigButtons: !profile.bigButtons });
    onAnyAction();
  };

  const onOff = (value?: boolean) =>
    value
      ? t(tx("common", "settings.on"))
      : t(tx("common", "settings.off"));

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        {t(tx("common", "settings.title"))}
      </div>

      <div className={styles.inlineControl}>
        <LanguageSwitcher />
      </div>

      <div className={styles.list}>
        <DropdownItem
          label={`${t(tx("common", "settings.highContrast"))}: ${onOff(
            profile?.highContrast
          )}`}
          onClick={toggleHighContrast}
        />

        <DropdownItem
          label={`${t(tx("common", "settings.bigButtons"))}: ${onOff(
            profile?.bigButtons
          )}`}
          onClick={toggleBigButtons}
        />
      </div>
    </div>
  );
}
