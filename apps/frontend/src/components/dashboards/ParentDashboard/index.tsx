"use client";

import styles from "./ParentDashboard.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import { tx } from "@/lib/i18n/tx";

export default function ParentDashboard() {
  const { t } = useTranslation();
  const { profiles, createProfile } = useUserProfile();

  const childrenProfiles = profiles.filter(
    (p) => p.role === "child"
  );

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h1>{t(tx("common", "parentDashboard.title"))}</h1>
        <p>{t(tx("common", "parentDashboard.subtitle"))}</p>
      </header>

      <div className={styles.content}>
        {childrenProfiles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t(tx("common", "parentDashboard.noChild"))}</p>

            <button
              className={styles.primaryBtn}
              onClick={() =>
                createProfile({
                  name: t(tx("common", "parentDashboard.defaultChildName")),
                  role: "child",
                })
              }
            >
              {t(tx("common", "parentDashboard.createChild"))}
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            <p>{t(tx("common", "parentDashboard.selectChild"))}</p>

            <ul>
              {childrenProfiles.map((child) => (
                <li key={child.id} className={styles.childCard}>
                  <span>{child.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}