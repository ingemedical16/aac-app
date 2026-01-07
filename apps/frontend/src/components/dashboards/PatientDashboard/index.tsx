"use client";

import styles from "./PatientDashboard.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import { tx } from "@/lib/i18n/tx";

export default function PatientDashboard() {
  const { t } = useTranslation();
  const { profiles, createProfile, setActiveProfileId } = useUserProfile();

  /**
   * Group profiles = children / dependents
   */
  const groupProfiles = profiles.filter(
    (p) => p.usageMode === "group"
  );

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h1>{t(tx("common", "patientDashboard.title"))}</h1>
        <p>{t(tx("common", "patientDashboard.subtitle"))}</p>
      </header>

      <div className={styles.content}>
        {groupProfiles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t(tx("common", "patientDashboard.noProfile"))}</p>

            <button
              className={styles.primaryBtn}
              onClick={() =>
                createProfile({
                  name: t(
                    tx("common", "patientDashboard.defaultProfileName")
                  ),
                  usageMode: "group",
                })
              }
            >
              {t(tx("common", "patientDashboard.createProfile"))}
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            <p>{t(tx("common", "patientDashboard.selectProfile"))}</p>

            <ul>
              {groupProfiles.map((profile) => (
                <li
                  key={profile.id}
                  className={styles.profileCard}
                  onClick={() => setActiveProfileId(profile.id)}
                >
                  <span>{profile.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}