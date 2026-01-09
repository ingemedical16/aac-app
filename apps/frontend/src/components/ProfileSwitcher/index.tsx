// src/components/ProfileSwitcher/index.tsx
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
      {profiles.map((profile) => (
        <button
          key={profile.id}
          className={
            profile.id === activeProfileId
              ? styles.active
              : styles.inactive
          }
          onClick={() => setActiveProfileId(profile.id)}
        >
          {profile.name}
        </button>
      ))}
    </div>
  );
}