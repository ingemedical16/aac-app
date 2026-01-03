"use client";

import styles from "./LanguageSwitcher.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";

const FALLBACK_LANGS = ["en", "fr", "ar", "ro"];

export default function LanguageSwitcher() {
  const { profile } = useUserProfile();
  const pathname = usePathname();

  const segments = pathname?.split("/") ?? [];
  const currentLocale = segments[1] || "en";

  const restPath = segments.slice(2).join("/");
  const suffix = restPath ? `/${restPath}` : "";

  const languages =
    profile.settings.preferredLanguages?.length
      ? profile.settings.preferredLanguages
      : FALLBACK_LANGS;

  return (
    <div className={styles.switcher}>
      {languages.map((lng) => (
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