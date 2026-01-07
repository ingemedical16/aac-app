// src/types/userProfile.ts

export type ProfileType =
  | "INDIVIDUAL" // adult patient / self
  | "CHILD";     // linked to Child entity

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

  /* =========================
     SETTINGS
  ========================= */
  preferredLanguages: string[];
  highContrast: boolean;
  bigButtons: boolean;

  /* =========================
     METADATA
  ========================= */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}