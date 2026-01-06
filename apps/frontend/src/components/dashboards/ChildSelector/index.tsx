"use client";

import styles from "./ChildSelector.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

export default function ChildSelector() {
  const { t } = useTranslation("common");
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
  } = useUserProfile();

  const children = profiles.filter((p) => p.role === "child");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {t("profile.selectChild", "Select a child")}
      </h1>

      <div className={styles.grid}>
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => setActiveProfileId(child.id)}
            className={[
              styles.card,
              activeProfileId === child.id ? styles.active : "",
            ].join(" ")}
          >
            <span className={styles.avatar}>👶</span>
            <span className={styles.name}>{child.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}