"use client";

import styles from "./LanguageSwitcher.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const { profile } = useUserProfile();
  const pathname = usePathname();
  const current = pathname?.split("/")[1] ?? "en";

  return (
    <div className={styles.switcher}>
      {profile.preferredLanguages.map((lng) => (
        <Link
          key={lng}
          href={`/${lng}`}
          className={current === lng ? styles.active : undefined}
        >
          {lng.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
