"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import styles from "./Home.module.scss";

export default function Home() {
  const { t, i18n } = useTranslation("common");
  const { isAuthenticated } = useAuth();

  const locale = i18n.language || "en";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("appTitle")}</h1>

      <p className={styles.subtitle}>{t("boardTitle")}</p>

      <div className={styles.actions}>
        {/* Open board (public / demo / child) */}
        <Link
          href="/board"
          className={styles.primaryButton}
        >
          {t("openBoard", { defaultValue: "Open Communication Board" })}
        </Link>

        {/* Auth entry */}
        {!isAuthenticated && (
          <Link
            href={`/${locale}/login`}
            className={styles.secondaryButton}
          >
            {t("login", { defaultValue: "Login / Register" })}
          </Link>
        )}
      </div>
    </div>
  );
}