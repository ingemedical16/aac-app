"use client";

import { useState, useEffect } from "react";
import styles from "./ProfileEditor.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

export default function ProfileEditor() {
  const {
    profiles,
    activeProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
  } = useUserProfile();

  const { t } = useTranslation("common");

  const active = profiles.find((p) => p.id === activeProfileId);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"child" | "group">("child");

  useEffect(() => {
    if (!active) return;
    setName(active.name);
    setRole(active.role);
  }, [active]);

  if (!active) return null;

  return (
    <div className={styles.editor}>
      <h3>{t("profile.title")}</h3>

      <label>
        {t("profile.name")}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("profile.namePlaceholder")}
        />
      </label>

      <label>
        {t("profile.role")}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "child" | "group")}
        >
          <option value="child">{t("profile.roleChild")}</option>
          <option value="group">{t("profile.roleGroup")}</option>
        </select>
      </label>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => updateProfile(active.id, { name, role })}
        >
          {t("save")}
        </button>

        {profiles.length > 1 && (
          <button
            type="button"
            className={styles.danger}
            onClick={() => deleteProfile(active.id)}
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
        + {t("profile.add")}
      </button>
    </div>
  );
}
