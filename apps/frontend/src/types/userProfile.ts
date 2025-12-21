// apps/frontend/src/types/userProfile.ts

export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});

export type ProfileRole = "child" | "group";
export type GrammarMode = "simple" | "full" | "smart";

/**
 * New canonical profile model (Phase 5.2+)
 */
export interface AACProfile {
  id: string;
  name: string;
  role: ProfileRole;

  defaultLanguage: LocaleCode;
  preferredLanguages: LocaleCode[];

  highContrast: boolean;
  bigButtons: boolean;

  grammarMode: GrammarMode;
}

/**
 * Legacy v1 (used in old localStorage key: aac.userProfile.v1)
 * We keep it for migration only.
 */
export interface LegacyUserProfileV1 {
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;
}

/**
 * New storage state (Phase 5.2+)
 */
export interface ProfilesStateV1 {
  profiles: AACProfile[];
  activeProfileId: string;
}
