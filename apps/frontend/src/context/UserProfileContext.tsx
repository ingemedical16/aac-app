"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Profile, UserProfileState } from "@/types/userProfile";

const STORAGE_KEY = "aac.userProfile.v2";

const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Default",
  role: "child",
  settings: {
    preferredLanguages: ["en", "fr", "ar", "ro"],
    highContrast: false,
    bigButtons: false,
  },
};

type Ctx = {
  profiles: Profile[];
  activeProfileId: string;
  profile: Profile;

  setActiveProfileId: (id: string) => void;

  createProfile: (data: Pick<Profile, "name" | "role">) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;

  toggleHighContrast: () => void;
  toggleBigButtons: () => void;
};

const UserProfileContext = createContext<Ctx | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserProfileState>({
    profiles: [DEFAULT_PROFILE],
    activeProfileId: DEFAULT_PROFILE.id,
  });

  /* LOAD */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  /* SAVE */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const profile =
    state.profiles.find((p) => p.id === state.activeProfileId) ??
    state.profiles[0];

  const setActiveProfileId = (id: string) => {
    setState((s) => ({ ...s, activeProfileId: id }));
  };

  const createProfile = ({ name, role }: Pick<Profile, "name" | "role">) => {
    const id = crypto.randomUUID();
    setState((s) => ({
      profiles: [
        ...s.profiles,
        {
          id,
          name,
          role,
          settings: { ...DEFAULT_PROFILE.settings },
        },
      ],
      activeProfileId: id,
    }));
  };

  const updateProfile = (id: string, data: Partial<Profile>) => {
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  };

  const deleteProfile = (id: string) => {
    setState((s) => {
      const profiles = s.profiles.filter((p) => p.id !== id);
      return {
        profiles,
        activeProfileId: profiles[0].id,
      };
    });
  };

  const toggleHighContrast = () => {
    updateProfile(profile.id, {
      settings: {
        ...profile.settings,
        highContrast: !profile.settings.highContrast,
      },
    });
  };

  const toggleBigButtons = () => {
    updateProfile(profile.id, {
      settings: {
        ...profile.settings,
        bigButtons: !profile.settings.bigButtons,
      },
    });
  };

  const value = useMemo(
    () => ({
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      profile,

      setActiveProfileId,
      createProfile,
      updateProfile,
      deleteProfile,

      toggleHighContrast,
      toggleBigButtons,
    }),
    [state, profile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within provider");
  return ctx;
}
