"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile } from "@/types/userProfile";

interface UserProfileContextType {
  profile: UserProfile;
  updateLanguages: (langs: UserProfile["preferredLanguages"]) => void;
}

const defaultProfile: UserProfile = {
  id: "default",
  name: "Child",
  preferredLanguages: ["en", "fr", "ar", "ro"],
  primaryLanguage: "en",
};

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  function updateLanguages(langs: UserProfile["preferredLanguages"]) {
    setProfile((prev) => ({
      ...prev,
      preferredLanguages: langs,
      primaryLanguage: langs[0],
    }));
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateLanguages }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used inside UserProfileProvider");
  }
  return ctx;
}
