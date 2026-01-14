"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthSection.module.scss";

import { useAuth } from "@/context/AuthContext";
import { ViewMode } from "@/types/viewMode";
import DropdownItem from "../DropdownItem";

import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

type AuthSectionProps = {
  viewMode: ViewMode;
  isAuthenticated: boolean;
  canManageProfiles: boolean;
  onNavigate: () => void;
  onLogout: () => void;
};
type AuthItem = {
  label: string;
  href: string;
  disabled?: boolean;
};


export default function AuthSection({
  isAuthenticated,
  canManageProfiles,
  onNavigate,
  onLogout,
}: AuthSectionProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const items = useMemo<AuthItem[]>(() => {
  if (!isAuthenticated) {
    return [
      {
        label: t(tx("common", "auth.login")),
        href: "/login",
      },
      {
        label: t(tx("common", "auth.register")),
        href: "/register",
      },
    ];
  }

  const base: AuthItem[] = [
    {
      label: t(tx("common", "auth.dashboard")),
      href: "/dashboard",
    },
  ];

  const profiles: AuthItem = {
    label: t(tx("common", "auth.profiles")),
    href: "/dashboard?tab=profiles",
    disabled: !canManageProfiles,
  };

  const board: AuthItem = {
    label: t(tx("common", "auth.goToBoard")),
    href: "/board",
  };

  const role = user?.role;

  const roleExtras: AuthItem[] =
    role === "ADMIN"
      ? [
          {
            label: t(tx("common", "auth.adminTools")),
            href: "/dashboard?tab=admin",
          },
        ]
      : role === "PROFESSIONAL"
      ? [
          {
            label: t(tx("common", "auth.professionalTools")),
            href: "/dashboard?tab=pro",
          },
        ]
      : [];

  return [...base, profiles, board, ...roleExtras];
}, [isAuthenticated, canManageProfiles, user?.role, t]);

  const go = (href: string) => {
    router.push(href);
    onNavigate();
  };

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        {isAuthenticated
          ? t(tx("common", "auth.account"))
          : t(tx("common", "auth.welcome"))}
      </div>

      <div className={styles.list}>
        {items.map((it) => (
          <DropdownItem
            key={it.href}
            label={it.label}
            disabled={it.disabled}
            onClick={() => go(it.href)}
          />
        ))}

        {isAuthenticated && (
          <DropdownItem
            label={t(tx("common", "auth.logout"))}
            variant="danger"
            onClick={onLogout}
          />
        )}
      </div>
    </div>
  );
}
