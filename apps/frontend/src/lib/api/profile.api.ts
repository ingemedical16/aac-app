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

  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  sex?: string | null;
  avatarUrl?: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getProfiles(): Promise<ProfileResponseDto[]> {
  const { data } = await http.get("/profiles");
  return data;
}

export async function createProfile(
  input: Omit<ProfileResponseDto, "id" | "isActive" | "createdAt" | "updatedAt">
): Promise<ProfileResponseDto> {
  const { data } = await http.post("/profiles", input);
  return data;
}

export async function updateProfile(
  id: string,
  input: Partial<Omit<ProfileResponseDto, "id">>
): Promise<ProfileResponseDto> {
  const { data } = await http.patch(`/profiles/${id}`, input);
  return data;
}

export async function deactivateProfile(id: string): Promise<{ success: boolean }> {
  const { data } = await http.delete(`/profiles/${id}`);
  return data;
}