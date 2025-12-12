export interface UserProfile {
  id: string;
  name: string;
  preferredLanguages: Array<"en" | "fr" | "ar" | "ro">;
  primaryLanguage: "en" | "fr" | "ar" | "ro";
}
