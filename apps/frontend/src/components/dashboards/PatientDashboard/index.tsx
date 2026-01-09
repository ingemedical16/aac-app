// src/components/dashboards/PatientDashboard/index.tsx
"use client";

import styles from "./PatientDashboard.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import { withLocale } from "@/lib/navigation/withLocale";
import { useRouter, useParams } from "next/navigation";

export default function PatientDashboard() {
  const { t } = useTranslation();
  const { profiles, setActiveProfileId } = useUserProfile();
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const childProfiles = profiles.filter(
    (p) => p.type === "CHILD"
  );

  return (
    <section className={styles.wrapper}>
      <h1>{t("patientDashboard.title")}</h1>

      {childProfiles.length === 0 ? (
        <p>{t("patientDashboard.noChildren")}</p>
      ) : (
        <ul className={styles.list}>
          {childProfiles.map((child) => (
            <li key={child.id}>
              <button
                onClick={() => {
                  setActiveProfileId(child.id);
                  router.push(withLocale(locale, "/board"));
                }}
              >
                {child.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}