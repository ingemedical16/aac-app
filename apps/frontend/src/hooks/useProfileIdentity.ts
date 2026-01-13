// src/hooks/useProfileIdentity.ts
"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

const DEFAULT_AVATAR = "/avatar.svg";

export function useProfileIdentity() {
  const { isAuthenticated } = useAuth();
  const { profile } = useUserProfile();

  if (!isAuthenticated || !profile) {
    return {
      avatarUrl: DEFAULT_AVATAR,
      displayName: "",
      isAuthenticated: false,
    };
  }

  return {
    avatarUrl: profile.avatarUrl || DEFAULT_AVATAR,
    displayName: profile.name || "",
    isAuthenticated: true,
  };
}