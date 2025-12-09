"use client";

import Link from "next/link";
import styles from "./LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  return (
    <div className={styles.switcher}>
      <Link href="/en">EN</Link>
      <Link href="/fr">FR</Link>
      <Link href="/ar">AR</Link>
      <Link href="/ro">RO</Link>
    </div>
  );
}
