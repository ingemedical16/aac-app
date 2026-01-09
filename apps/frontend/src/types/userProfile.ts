// src/types/userProfile.ts

export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});
export type ProfileType =
  | "INDIVIDUAL" // adult patient / self
  | "CHILD";     // linked to Child entity

export interface ProfileSettings {
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;
}
export interface Profile {
  id: string;

  /* =========================
     IDENTITY
  ========================= */
  name: string;
  type: ProfileType;

  /**
   * Only present when type === CHILD
   */
  childId?: string | null;

   // optional identity fields (if you add them later on backend)
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO date string from API
  sex?: string | null;
  avatarUrl?: string | null;

  /* =========================
     SETTINGS
  ========================= */
  settings: ProfileSettings;

  /* =========================
     METADATA
  ========================= */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
}