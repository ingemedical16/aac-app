"use client";

import { useState } from "react";
import styles from "./AppHeader.module.scss";
import MobileMenu from "@/components/MobileMenu";
import { useTranslation } from "react-i18next";

export default function AppHeader() {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(true)}
          aria-label={t("openMenu")}
        >
          ☰
        </button>

        <div className={styles.center}>
          <h1>{t("appTitleShort")}</h1>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
