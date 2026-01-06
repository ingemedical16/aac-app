export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});



export interface ProfileSettings {
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;
}

export type UsageMode = "single" | "group";

export interface Profile {
  id: string;
  name: string;
  usageMode: UsageMode;
  settings: ProfileSettings;
}

export interface UserProfileState {
  profiles: Profile[];
  activeProfileId: string;
}

/* 🔐 Persisted storage shape (v2) */
export interface PersistedStateV2 {
  version: 2;
  data: UserProfileState;
}
