"use client";

import styles from "./LanguageSwitcher.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";

const FALLBACK_LANGS = ["en", "fr", "ar", "ro"];

export default function LanguageSwitcher() {
  const { profile } = useUserProfile(); // ✅ correct source
  const pathname = usePathname();
  const current = pathname?.split("/")[1] ?? "en";

  const languages =
    profile.settings.preferredLanguages?.length
      ? profile.settings.preferredLanguages
      : FALLBACK_LANGS;

  return (
    <div className={styles.switcher}>
      {languages.map((lng) => (
        <Link
          key={lng}
          href={`/${lng}`}
          className={current === lng ? styles.active : ""}
        >
          {lng.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
