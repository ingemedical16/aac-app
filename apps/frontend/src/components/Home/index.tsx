"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import styles from "./Home.module.scss";

export default function Home() {
  const { t } = useTranslation("common");
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.title}>{t("home.title")}</h1>
        <p className={styles.subtitle}>{t("home.subtitle")}</p>
      </section>

      {/* Primary actions */}
      <section className={styles.actions}>
        <Link href="/board" className={styles.primaryButton}>
          {t("home.openBoard")}
        </Link>

        {!isAuthenticated && (
          <Link href="/login" className={styles.secondaryButton}>
            {t("home.getStarted")}
          </Link>
        )}
      </section>

      {/* Value props */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>{t("home.features.easy.title")}</h3>
          <p>{t("home.features.easy.description")}</p>
        </div>

        <div className={styles.feature}>
          <h3>{t("home.features.accessible.title")}</h3>
          <p>{t("home.features.accessible.description")}</p>
        </div>

        <div className={styles.feature}>
          <h3>{t("home.features.secure.title")}</h3>
          <p>{t("home.features.secure.description")}</p>
        </div>
      </section>

      {/* Footer note */}
      <footer className={styles.footer}>
        <p>{t("home.footer")}</p>
      </footer>
    </div>
  );
}
