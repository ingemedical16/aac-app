"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./DropdownMenu.module.scss";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { ViewMode } from "@/types/viewMode";

import AuthSection from "./AuthSection";
import SettingsSection from "./SettingsSection";

import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

type DropdownMenuProps = {
  viewMode: ViewMode;
  /** Trigger element (ProfileInfo, icon, etc.) */
  trigger: React.ReactNode;
};

export default function DropdownMenu({ viewMode, trigger }: DropdownMenuProps) {
  const { t } = useTranslation();
  const { isReady, isAuthenticated, logout } = useAuth();
  const { profile } = useUserProfile();

  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const canManageProfiles = useMemo(() => {
    // If active profile is CHILD => disable "Profiles" management entry
    return profile?.type !== "CHILD";
  }, [profile?.type]);

  /* =========================
     CLOSE HANDLERS
  ========================= */

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!rootRef.current) return;
      if (!rootRef.current.contains(target)) setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* =========================
     ACTIONS
  ========================= */

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  /* =========================
     RENDER
  ========================= */

  // Prevent rendering before auth hydration (avoids flicker)
  if (!isReady) {
    return <div className={styles.root}>{trigger}</div>;
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(tx("common", "dropdown.openMenu"))}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>

      {open && (
        <div
          ref={panelRef}
          className={styles.panel}
          role="menu"
          aria-label={t(tx("common", "dropdown.menuLabel"))}
        >
          <AuthSection
            viewMode={viewMode}
            isAuthenticated={isAuthenticated}
            canManageProfiles={canManageProfiles}
            onNavigate={() => setOpen(false)}
            onLogout={handleLogout}
          />

          <div className={styles.divider} />

          <SettingsSection onAnyAction={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}