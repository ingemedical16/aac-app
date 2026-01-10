// src/components/dashboards/userDashboard/index.tsx
"use client";

import styles from "./userDashboard.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import { withLocale } from "@/lib/navigation/withLocale";
import { useRouter, useParams } from "next/navigation";

export default function userDashboard() {
  const { t } = useTranslation();
  const { profiles, setActiveProfileId } = useUserProfile();
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const childProfiles = profiles.filter((p) => p.type === "CHILD");

  return (
    <section className={styles.wrapper}>
      <h1>{t("userDashboard.title")}</h1>

      {childProfiles.length === 0 ? (
        <p>{t("userDashboard.noChildren")}</p>
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
