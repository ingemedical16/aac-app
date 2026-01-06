"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Profile, UserProfileState } from "@/types/userProfile";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import { useTranslation } from "react-i18next";

/* =========================
   STORAGE
========================= */
const STORAGE_KEY = "aac.userProfile.v2";

/* =========================
   DEFAULT PROFILE
========================= */
const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Default",
  usageMode: "single", // ✅ single | group
  settings: {
    preferredLanguages: [...SUPPORTED_LANGUAGES],
    highContrast: false,
    bigButtons: false,
  },
};

/* =========================
   CONTEXT TYPE
========================= */
type Ctx = {
  profiles: Profile[];
  activeProfileId: string;
  profile: Profile;

  setActiveProfileId: (id: string) => void;

  createProfile: (
    data: Pick<Profile, "name" | "usageMode">
  ) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;

  toggleHighContrast: () => void;
  toggleBigButtons: () => void;
};

const UserProfileContext = createContext<Ctx | null>(null);

/* =========================
   PROVIDER
========================= */
export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<UserProfileState>({
    profiles: [DEFAULT_PROFILE],
    activeProfileId: DEFAULT_PROFILE.id,
  });

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed?.profiles && parsed?.activeProfileId) {
        setState(parsed);
      }
    } catch {
      // silent fallback
    }
  }, []);

  /* =========================
     SAVE
  ========================= */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // silent fallback
    }
  }, [state]);

  /* =========================
     DERIVED
  ========================= */
  const profile =
    state.profiles.find((p) => p.id === state.activeProfileId) ??
    state.profiles[0];

  /* =========================
     ACTIONS
  ========================= */
  const setActiveProfileId = (id: string) => {
    setState((s) => ({ ...s, activeProfileId: id }));
  };

  const createProfile = ({
    name,
    usageMode,
  }: Pick<Profile, "name" | "usageMode">) => {
    const id = crypto.randomUUID();

    setState((s) => ({
      profiles: [
        ...s.profiles,
        {
          id,
          name,
          usageMode,
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
        activeProfileId: profiles[0]?.id ?? DEFAULT_PROFILE.id,
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

  /* =========================
     CONTEXT VALUE
  ========================= */
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

/* =========================
   HOOK
========================= */
export function useUserProfile() {
  const { t } = useTranslation()
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error(
      t("errors.userProfileContext.missingProvider")
    );
  }
  return ctx;
}