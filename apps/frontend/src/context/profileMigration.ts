import { Profile, UserProfileState } from "@/types/userProfile";

const DEFAULT_PROFILE_ID = "default";

/**
 * Migrates any known legacy profile format to v2 UserProfileState
 */
export function migrateToV2(raw: any): UserProfileState {
  // ✅ Already v2
  if (raw?.version === 2 && raw?.data?.profiles) {
    return raw.data;
  }

  // ✅ v1 legacy format (single profile, flat)
  if (
    raw?.preferredLanguages ||
    raw?.highContrast !== undefined ||
    raw?.bigButtons !== undefined
  ) {
    const profile: Profile = {
      id: DEFAULT_PROFILE_ID,
      name: "Default",
      role: "child",
      settings: {
        preferredLanguages: raw.preferredLanguages ?? ["en"],
        highContrast: !!raw.highContrast,
        bigButtons: !!raw.bigButtons,
      },
    };

    return {
      profiles: [profile],
      activeProfileId: profile.id,
    };
  }

  // ✅ Fallback (corrupt / unknown)
  return {
    profiles: [
      {
        id: DEFAULT_PROFILE_ID,
        name: "Default",
        role: "child",
        settings: {
          preferredLanguages: ["en"],
          highContrast: false,
          bigButtons: false,
        },
      },
    ],
    activeProfileId: DEFAULT_PROFILE_ID,
  };
}
