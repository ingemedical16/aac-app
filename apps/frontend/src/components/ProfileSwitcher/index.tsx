"use client";

import styles from "./ProfileSwitcher.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";

export default function ProfileSwitcher() {
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
  } = useUserProfile();

  if (profiles.length <= 1) return null;

  return (
    <div className={styles.switcher}>
      {profiles.map((p) => (
        <button
          key={p.id}
          type="button"
          className={p.id === activeProfileId ? styles.active : styles.btn}
          onClick={() => setActiveProfileId(p.id)}
          aria-pressed={p.id === activeProfileId}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
