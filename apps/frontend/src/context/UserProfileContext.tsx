// src/context/UserProfileContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Profile, UserProfileState } from "@/types/userProfile";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import { useAuth } from "@/context/AuthContext";
import {
  getProfiles,
  createProfile as apiCreateProfile,
  updateProfile as apiUpdateProfile,
  deactivateProfile as apiDeactivateProfile,
  type ProfileResponseDto,
  type CreateProfileInput,
  type UpdateProfileInput,
} from "@/lib/api/profile.api";

const CACHE_KEY = "aac.profiles.cache.v1";
const ACTIVE_ID_KEY = "aac.profiles.activeId.v1";

type Ctx = {
  isReady: boolean;

  profiles: Profile[];
  activeProfileId: string | null;
  profile: Profile | null;

  setActiveProfileId: (id: string) => void;

  refresh: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<void>;
  updateProfile: (id: string, input: UpdateProfileInput) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
};

const UserProfileContext = createContext<Ctx | null>(null);

function mapDtoToProfile(dto: ProfileResponseDto): Profile {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    childId: dto.childId ?? null,

    firstName: dto.firstName ?? null,
    lastName: dto.lastName ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,
    sex: dto.sex ?? null,
    avatarUrl: dto.avatarUrl ?? null,

    settings: {
      preferredLanguages: (dto.preferredLanguages?.length
        ? dto.preferredLanguages
        : [...SUPPORTED_LANGUAGES]) as any,
      highContrast: !!dto.highContrast,
      bigButtons: !!dto.bigButtons,
    },

    isActive: !!dto.isActive,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

function readCache(): Profile[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Profile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCache(profiles: Profile[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(profiles));
  } catch {}
}

function readActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

function writeActiveId(id: string) {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch {}
}

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { isReady: authReady, isAuthenticated } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState<UserProfileState>({
    profiles: [],
    activeProfileId: null,
  });

  const refresh = async () => {
    // If not authenticated: load cache only (public pages shouldn’t crash)
    if (!isAuthenticated) {
      const cached = readCache();
      const activeId = readActiveId();
      setState({
        profiles: cached,
        activeProfileId:
          activeId && cached.some((p) => p.id === activeId)
            ? activeId
            : cached[0]?.id ?? null,
      });
      return;
    }

    try {
      const dtos = await getProfiles();
      const profiles = dtos.map(mapDtoToProfile).filter((p) => p.isActive);

      writeCache(profiles);

      const storedActive = readActiveId();
      const nextActive =
        storedActive && profiles.some((p) => p.id === storedActive)
          ? storedActive
          : profiles[0]?.id ?? null;

      if (nextActive) writeActiveId(nextActive);

      setState({ profiles, activeProfileId: nextActive });
    } catch {
      // Offline fallback
      const cached = readCache();
      const storedActive = readActiveId();
      setState({
        profiles: cached,
        activeProfileId:
          storedActive && cached.some((p) => p.id === storedActive)
            ? storedActive
            : cached[0]?.id ?? null,
      });
    }
  };

  useEffect(() => {
    if (!authReady) return;

    (async () => {
      await refresh();
      setIsReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, isAuthenticated]);

  const setActiveProfileId = (id: string) => {
    setState((s) => ({ ...s, activeProfileId: id }));
    writeActiveId(id);
  };

  const createProfile = async (input: CreateProfileInput) => {
    await apiCreateProfile(input);
    await refresh();
  };

  const updateProfile = async (id: string, input: UpdateProfileInput) => {
    await apiUpdateProfile(id, input);
    await refresh();
  };

  const deleteProfile = async (id: string) => {
    await apiDeactivateProfile(id);
    await refresh();
  };

  const profile =
    state.activeProfileId
      ? state.profiles.find((p) => p.id === state.activeProfileId) ?? null
      : null;

  const value = useMemo<Ctx>(
    () => ({
      isReady,
      profiles: state.profiles,
      activeProfileId: state.activeProfileId,
      profile,
      setActiveProfileId,
      refresh,
      createProfile,
      updateProfile,
      deleteProfile,
    }),
    [isReady, state.profiles, state.activeProfileId, profile]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    // Keep runtime message simple; UI i18n handling can be added later
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
