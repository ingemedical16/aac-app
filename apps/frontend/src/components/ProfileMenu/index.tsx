// src/components/ProfileMenu/index.tsx
"use client";

import styles from "./ProfileMenu.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";

export default function ProfileMenu() {
  const { profile, updateProfile } = useUserProfile();

  if (!profile) return null;

  return (
    <div className={styles.menu}>
      <label>
        <input
          type="checkbox"
          checked={profile.highContrast}
          onChange={() =>
            updateProfile(profile.id, {
              highContrast: !profile.highContrast,
            })
          }
        />
        High contrast
      </label>

      <label>
        <input
          type="checkbox"
          checked={profile.bigButtons}
          onChange={() =>
            updateProfile(profile.id, {
              bigButtons: !profile.bigButtons,
            })
          }
        />
        Big buttons
      </label>
    </div>
  );
}