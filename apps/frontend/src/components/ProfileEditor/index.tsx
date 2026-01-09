"use client";

import { useEffect, useState } from "react";
import styles from "./ProfileEditor.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";
import type { LocaleCode } from "@/types/userProfile";

const ALL_LANGS: LocaleCode[] = ["en", "fr", "ar", "ro"];

export default function ProfileEditor() {
  const { profile, updateProfile, createProfile, deleteProfile, profiles } =
    useUserProfile();

  const { t } = useTranslation("common");

  const [name, setName] = useState(profile.name);
  const [languages, setLanguages] = useState<LocaleCode[]>(
    profile.preferredLanguages
  );

  useEffect(() => {
    setName(profile.name);
    setLanguages(profile.preferredLanguages);
  }, [profile]);

  const toggleLanguage = (lng: LocaleCode) => {
    setLanguages((prev) => {
      if (prev.includes(lng)) {
        return prev.length > 1 ? prev.filter((l) => l !== lng) : prev;
      }
      return [...prev, lng];
    });
  };

  const saveProfile = () => {
    updateProfile(profile.id, {
      name,
      settings: {
        ...profile,
        preferredLanguages: languages,
      },
    });
  };

  return (
    <div className={styles.editor}>
      <h3>{t("profile.title")}</h3>

      {/* NAME */}
      <label className={styles.field}>
        <span>{t("profile.name")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("profile.namePlaceholder")}
        />
      </label>

      {/* ROLE (READ-ONLY FOR NOW) */}
      <div className={styles.field}>
        <span>{t("profile.role")}</span>
        <strong>{t(`profile.role_${profile.role}`)}</strong>
      </div>

      {/* LANGUAGES */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t("profile.languages")}</div>

        <div className={styles.langGrid}>
          {ALL_LANGS.map((lng) => (
            <label key={lng} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={languages.includes(lng)}
                onChange={() => toggleLanguage(lng)}
              />
              {lng.toUpperCase()}
            </label>
          ))}
        </div>

        <small className={styles.hint}>{t("profile.languagesHint")}</small>
      </div>

      {/* ACCESSIBILITY */}
      <div className={styles.section}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={profile.highContrast}
            onChange={() =>
              updateProfile(profile.id, {
                settings: {
                  ...profile,
                  highContrast: !profile.highContrast,
                },
              })
            }
          />
          {t("highContrast")}
        </label>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={profile.bigButtons}
            onChange={() =>
              updateProfile(profile.id, {
                settings: {
                  ...profile,
                  bigButtons: !profile.bigButtons,
                },
              })
            }
          />
          {t("bigButtons")}
        </label>
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button onClick={saveProfile}>{t("save")}</button>

        {profiles.length > 1 && (
          <button
            className={styles.danger}
            onClick={() => deleteProfile(profile.id)}
          >
            {t("delete")}
          </button>
        )}
      </div>

      <hr />

      <button
        type="button"
        onClick={() =>
          createProfile({
            name: t("profile.newProfile"),
            role: "child",
          })
        }
      >
        ➕ {t("profile.add")}
      </button>
    </div>
  );
}
