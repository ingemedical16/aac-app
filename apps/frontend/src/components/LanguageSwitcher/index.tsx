"use client";

import styles from "./LanguageSwitcher.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const segments = pathname?.split("/") ?? [];

  const currentLocale = segments[1] || "en";
  const restPath = segments.slice(2).join("/");
  const suffix = restPath ? `/${restPath}` : "";

  return (
    <div className={styles.switcher}>
      {SUPPORTED_LANGUAGES.map((lng) => (
        <Link
          key={lng}
          href={`/${lng}${suffix}`}
          className={currentLocale === lng ? styles.active : ""}
        >
          {lng.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
