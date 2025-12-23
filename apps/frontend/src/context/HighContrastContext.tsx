"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type Ctx = {
  highContrast: boolean;
  toggleHighContrast: () => void;
};

const HighContrastContext = createContext<Ctx | null>(null);

export function HighContrastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, toggleHighContrast } = useUserProfile();

  const value = useMemo(
    () => ({ highContrast: profile.settings.highContrast, toggleHighContrast }),
    [profile.settings.highContrast, toggleHighContrast]
  );

  return (
    <HighContrastContext.Provider value={value}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const ctx = useContext(HighContrastContext);
  if (!ctx)
    throw new Error("useHighContrast must be used within HighContrastProvider");
  return ctx;
}
