"use client";

import styles from "./LanguageSwitcher.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";
import { useHighContrast } from "@/context/HighContrastContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const { profile } = useUserProfile();
  const { highContrast } = useHighContrast();
  const pathname = usePathname();

  return (
    <div
      className={`${styles.switcher} ${
        highContrast ? styles.highContrast : ""
      }`}
    >
      {profile.preferredLanguages.map((lng) => {
        const isActive = pathname === `/${lng}`;

        return (
          <Link
            key={lng}
            href={`/${lng}`}
            className={isActive ? styles.active : ""}
          >
            {lng.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
