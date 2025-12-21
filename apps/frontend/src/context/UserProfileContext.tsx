"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AACProfile,
  LegacyUserProfileV1,
  LocaleCode,
  ProfilesStateV1,
} from "@/types/userProfile";

const STORAGE_KEY_V2 = "aac.profiles.v1";
const STORAGE_KEY_V1 = "aac.userProfile.v1";

const DEFAULT_LOCALE: LocaleCode = "en";

const makeId = () =>
  `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const makeDefaultProfile = (overrides?: Partial<AACProfile>): AACProfile => ({
  id: makeId(),
  name: "Default",
  role: "child",
  defaultLanguage: DEFAULT_LOCALE,
  preferredLanguages: ["en", "fr", "ar", "ro"],
  highContrast: false,
  bigButtons: false,
  grammarMode: "simple",
  ...overrides,
});

const migrateV1ToV2 = (v1: LegacyUserProfileV1 | null): ProfilesStateV1 => {
  const preferred =
    v1?.preferredLanguages?.length ? v1.preferredLanguages : ["en", "fr", "ar", "ro"];
  const defaultLanguage = (preferred[0] ?? DEFAULT_LOCALE) as LocaleCode;

  const profile = makeDefaultProfile({
    name: "Default",
    role: "child",
    defaultLanguage,
    preferredLanguages: preferred,
    highContrast: !!v1?.highContrast,
    bigButtons: !!v1?.bigButtons,
  });

  return {
    profiles: [profile],
    activeProfileId: profile.id,
  };
};

type Ctx = {
  // New API (Phase 5.2+)
  profiles: AACProfile[];
  activeProfileId: string;
  activeProfile: AACProfile;

  setActiveProfileId: (id: string) => void;

  addProfile: (profile: Omit<AACProfile, "id"> & { id?: string }) => string;
  updateProfile: (id: string, patch: Partial<AACProfile>) => void;
  removeProfile: (id: string) => void;

  // Backward-compatible API (keeps app working with existing components)
  profile: AACProfile;
  setProfile: React.Dispatch<React.SetStateAction<AACProfile>>;
  toggleHighContrast: () => void;
  toggleBigButtons: () => void;
};

const UserProfileContext = createContext<Ctx | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfilesStateV1>(() => {
    // SSR-safe init (real load happens in useEffect)
    const p = makeDefaultProfile();
    return { profiles: [p], activeProfileId: p.id };
  });

  // Load + migrate
  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (rawV2) {
        const parsed = JSON.parse(rawV2) as ProfilesStateV1;
        if (parsed?.profiles?.length && parsed.activeProfileId) {
          setState(parsed);
          return;
        }
      }

      const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1) as LegacyUserProfileV1;
        const migrated = migrateV1ToV2(parsedV1);
        setState(migrated);
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
        return;
      }

      // no storage → keep defaults
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Save (v2 only)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const activeProfile = useMemo(() => {
    const found = state.profiles.find((p) => p.id === state.activeProfileId);
    return found ?? state.profiles[0] ?? makeDefaultProfile();
  }, [state]);

  // Backward-compatible setter for "profile" (updates only active profile)
  const setProfile: React.Dispatch<React.SetStateAction<AACProfile>> = (updater) => {
    setState((prev) => {
      const current =
        prev.profiles.find((p) => p.id === prev.activeProfileId) ?? prev.profiles[0];

      if (!current) return prev;

      const nextValue =
        typeof updater === "function"
          ? (updater as (p: AACProfile) => AACProfile)(current)
          : updater;

      return {
        ...prev,
        profiles: prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, ...nextValue, id: p.id } : p
        ),
      };
    });
  };

  const setActiveProfileId = (id: string) => {
    setState((prev) => {
      const exists = prev.profiles.some((p) => p.id === id);
      if (!exists) return prev;
      return { ...prev, activeProfileId: id };
    });
  };

  const addProfile = (profile: Omit<AACProfile, "id"> & { id?: string }) => {
    const id = profile.id ?? makeId();
    setState((prev) => ({
      ...prev,
      profiles: [...prev.profiles, { ...profile, id }],
      activeProfileId: prev.activeProfileId || id,
    }));
    return id;
  };

  const updateProfile = (id: string, patch: Partial<AACProfile>) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === id ? { ...p, ...patch, id } : p)),
    }));
  };

  const removeProfile = (id: string) => {
    setState((prev) => {
      const nextProfiles = prev.profiles.filter((p) => p.id !== id);
      if (!nextProfiles.length) {
        const fallback = makeDefaultProfile();
        return { profiles: [fallback], activeProfileId: fallback.id };
      }

      const nextActive =
        prev.activeProfileId === id ? nextProfiles[0].id : prev.activeProfileId;

      return { profiles: nextProfiles, activeProfileId: nextActive };
    });
  };

  const toggleHighContrast = () => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? { ...p, highContrast: !p.highContrast } : p
      ),
    }));
  };

  const toggleBigButtons = () => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === prev.activeProfileId ? { ...p, bigButtons: !p.bigButtons } : p
      ),
    }));
  };

  const value = useMemo<Ctx>(
    () => ({
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      activeProfile,

      setActiveProfileId,
      addProfile,
      updateProfile,
      removeProfile,

      // backward-compatible
      profile: activeProfile,
      setProfile,
      toggleHighContrast,
      toggleBigButtons,
    }),
    [state.profiles, state.activeProfileId, activeProfile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
