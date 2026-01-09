export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});

export type ProfileType = "INDIVIDUAL" | "CHILD";

export interface Profile {
  id: string;

  /* =========================
     IDENTITY
  ========================= */
  name: string;
  type: ProfileType;
  childId?: string | null;

  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  sex?: string | null;
  avatarUrl?: string | null;

  /* =========================
     SETTINGS (FLAT)
  ========================= */
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;

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