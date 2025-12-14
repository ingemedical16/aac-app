export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});

export interface UserProfile {
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;
}
