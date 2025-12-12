"use client";

import { createContext, useContext, useState } from "react";

interface HighContrastContextValue {
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const HighContrastContext = createContext<HighContrastContextValue | null>(null);

export function HighContrastProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;

      // APPLY CLASS TO BODY
      if (next) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }

      return next;
    });
  };

  return (
    <HighContrastContext.Provider value={{ highContrast, toggleHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const ctx = useContext(HighContrastContext);
  if (!ctx) throw new Error("useHighContrast must be used inside provider");
  return ctx;
}
