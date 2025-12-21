export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});

export type ProfileRole = "child" | "group";

export interface ProfileSettings {
  preferredLanguages: LocaleCode[];
  highContrast: boolean;
  bigButtons: boolean;
}

export interface Profile {
  id: string;
  name: string;
  role: ProfileRole;
  settings: ProfileSettings;
}

export interface UserProfileState {
  profiles: Profile[];
  activeProfileId: string;
}
