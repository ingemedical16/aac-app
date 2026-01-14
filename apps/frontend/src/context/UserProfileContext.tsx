"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Profile } from "@/types/userProfile";
import {
  getProfiles,
  createProfile as apiCreateProfile,
  updateProfile as apiUpdateProfile,
  deactivateProfile as apiDeactivateProfile,
} from "@/lib/api/profile.api";

import { useAuth } from "@/context/AuthContext";

/* =========================
   STORAGE KEYS
========================= */

const STORAGE_PROFILES = "aac.profiles.cache";
const STORAGE_ACTIVE_ID = "aac.profiles.activeId";

/* =========================
   CONTEXT TYPE
========================= */

type Ctx = {
  profiles: Profile[];
  activeProfileId: string | null;
  profile: Profile | null;

  refreshProfiles: () => Promise<void>;

  setActiveProfileId: (id: string) => void;
  createProfile: (input: Parameters<typeof apiCreateProfile>[0]) => Promise<void>;
  updateProfile: (id: string, input: Parameters<typeof apiUpdateProfile>[1]) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
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
  const { isReady, isAuthenticated } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  /* =========================
     LOAD FROM BACKEND
  ========================= */

  const refreshProfiles = async () => {
    const data = await getProfiles();

    setProfiles(data);
    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(data));

    const storedActiveId =
      localStorage.getItem(STORAGE_ACTIVE_ID) ?? data[0]?.id ?? null;

    setActiveProfileIdState(storedActiveId);
  };

  /* =========================
     BOOTSTRAP (AUTH → API → CACHE)
  ========================= */

  useEffect(() => {
    if (!isReady) return;

    // User is not authenticated → reset state
    if (!isAuthenticated) {
      setProfiles([]);
      setActiveProfileIdState(null);
      setIsLoaded(true);
      return;
    }

    // User authenticated → load profiles
    (async () => {
      try {
        await refreshProfiles();
      } catch {
        // Offline fallback
        try {
          const cached = localStorage.getItem(STORAGE_PROFILES);
          const activeId = localStorage.getItem(STORAGE_ACTIVE_ID);

          if (cached) {
            setProfiles(JSON.parse(cached));
            setActiveProfileIdState(activeId);
          }
        } catch {
          // silent
        }
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [isReady, isAuthenticated]);

  /* =========================
     ACTIVE PROFILE
  ========================= */

  const setActiveProfileId = (id: string) => {
    setActiveProfileIdState(id);
    localStorage.setItem(STORAGE_ACTIVE_ID, id);
  };

  const profile =
    profiles.find((p) => p.id === activeProfileId) ?? null;

  /* =========================
     CRUD ACTIONS
  ========================= */

  const createProfile = async (
    input: Parameters<typeof apiCreateProfile>[0]
  ) => {
    const created = await apiCreateProfile(input);
    const next = [...profiles, created];

    setProfiles(next);
    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(next));
    setActiveProfileId(created.id);
  };

  const updateProfile = async (
    id: string,
    input: Parameters<typeof apiUpdateProfile>[1]
  ) => {
    const updated = await apiUpdateProfile(id, input);
    const next = profiles.map((p) => (p.id === id ? updated : p));

    setProfiles(next);
    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(next));
  };

  const deleteProfile = async (id: string) => {
    await apiDeactivateProfile(id);

    const next = profiles.filter((p) => p.id !== id);
    setProfiles(next);
    localStorage.setItem(STORAGE_PROFILES, JSON.stringify(next));

    if (activeProfileId === id) {
      const fallback = next[0]?.id ?? null;
      setActiveProfileIdState(fallback);

      if (fallback) {
        localStorage.setItem(STORAGE_ACTIVE_ID, fallback);
      } else {
        localStorage.removeItem(STORAGE_ACTIVE_ID);
      }
    }
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo<Ctx>(
    () => ({
      profiles,
      activeProfileId,
      profile,

      refreshProfiles,

      setActiveProfileId,
      createProfile,
      updateProfile,
      deleteProfile,
    }),
    [profiles, activeProfileId, profile]
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
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
