// src/hooks/useCurrentLanguage.ts
"use client";

import i18next from "i18next";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  i18next.on("languageChanged", callback);
  return () => i18next.off("languageChanged", callback);
}

function getSnapshot() {
  return i18next.language;
}

export function useCurrentLanguage() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}