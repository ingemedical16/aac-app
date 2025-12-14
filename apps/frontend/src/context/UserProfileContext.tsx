"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/types/userProfile";

const STORAGE_KEY = "aac.userProfile.v1";

const DEFAULT_PROFILE: UserProfile = {
  preferredLanguages: ["en", "fr", "ar", "ro"],
  highContrast: false,
  bigButtons: false,
};

type Ctx = {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  toggleHighContrast: () => void;
  toggleBigButtons: () => void;
};

const UserProfileContext = createContext<Ctx | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  // save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const toggleHighContrast = () => {
    setProfile((p) => ({ ...p, highContrast: !p.highContrast }));
  };

  const toggleBigButtons = () => {
    setProfile((p) => ({ ...p, bigButtons: !p.bigButtons }));
  };

  const value = useMemo(
    () => ({ profile, setProfile, toggleHighContrast, toggleBigButtons }),
    [profile]
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
