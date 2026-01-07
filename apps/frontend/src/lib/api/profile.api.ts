// src/lib/api/profile.api.ts

import { http } from "./http";
import type { Profile } from "@/types/userProfile";

export const profileApi = {
  /* =========================
     READ
  ========================= */

  list(): Promise<Profile[]> {
    return http.get("/profiles");
  },

  get(id: string): Promise<Profile> {
    return http.get(`/profiles/${id}`);
  },

  /* =========================
     CREATE
  ========================= */

  create(payload: {
    name: string;
    type: "INDIVIDUAL" | "CHILD";
    childId?: string;
    preferredLanguages: string[];
    highContrast?: boolean;
    bigButtons?: boolean;
  }): Promise<Profile> {
    return http.post("/profiles", payload);
  },

  /* =========================
     UPDATE
  ========================= */

  update(
    id: string,
    payload: Partial<{
      name: string;
      preferredLanguages: string[];
      highContrast: boolean;
      bigButtons: boolean;
      isActive: boolean;
    }>
  ): Promise<Profile> {
    return http.patch(`/profiles/${id}`, payload);
  },

  /* =========================
     DEACTIVATE (soft delete)
  ========================= */

  deactivate(id: string): Promise<void> {
    return http.delete(`/profiles/${id}`);
  },
};