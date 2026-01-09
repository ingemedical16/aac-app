// src/lib/api/profile.api.ts

import { http } from "@/lib/api/http";
import type { ProfileType } from "@/types/userProfile";

export type ProfileResponseDto = {
  id: string;
  name: string;
  type: ProfileType;
  childId?: string | null;

  preferredLanguages: string[];
  highContrast: boolean;
  bigButtons: boolean;

  // optional (future)
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  sex?: string | null;
  avatarUrl?: string | null;

  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProfileInput = {
  name: string;
  type: ProfileType;
  childId?: string;

  preferredLanguages: string[];
  highContrast?: boolean;
  bigButtons?: boolean;

  // optional (future)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  sex?: string;
  avatarUrl?: string;
};

export type UpdateProfileInput = Partial<CreateProfileInput>;

export async function getProfiles(): Promise<ProfileResponseDto[]> {
  return http.get("/profiles");
}

export async function createProfile(
  input: CreateProfileInput
): Promise<ProfileResponseDto> {
  return http.post("/profiles", input);
}

export async function updateProfile(
  id: string,
  input: UpdateProfileInput
): Promise<ProfileResponseDto> {
  return http.patch(`/profiles/${id}`, input);
}

export async function deactivateProfile(id: string): Promise<{ success: boolean }> {
  return http.delete(`/profiles/${id}`);
}
