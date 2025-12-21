"use client";

import { useState } from "react";
import styles from "./ProfileMenu.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

export default function ProfileMenu() {
  const { t } = useTranslation("common");
  const {
    profiles,
    activeProfileId,
    profile,
    setActiveProfileId,
    createProfile,
    deleteProfile,
  } = useUserProfile();

  const [open, setOpen] = useState(false);

  return (
    <div className={styles.root}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
      >
        👤 {profile.name}
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.section}>
            <div className={styles.label}>{t("profiles")}</div>

            {profiles.map((p) => (
              <button
                key={p.id}
                className={`${styles.item} ${
                  p.id === activeProfileId ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveProfileId(p.id);
                  setOpen(false);
                }}
              >
                {p.name} · {t(`profileRole.${p.role}`)}
              </button>
            ))}
          </div>

          <div className={styles.section}>
            <button
              className={styles.item}
              onClick={() => {
                createProfile({
                  name: t("newProfile"),
                  role: "child",
                });
                setOpen(false);
              }}
            >
              ➕ {t("addProfile")}
            </button>

            {profiles.length > 1 && (
              <button
                className={styles.itemDanger}
                onClick={() => {
                  deleteProfile(profile.id);
                  setOpen(false);
                }}
              >
                🗑 {t("deleteProfile")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
