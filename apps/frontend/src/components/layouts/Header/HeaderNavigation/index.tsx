"use client";

import styles from "./HeaderNavigation.module.scss";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ViewMode } from "@/types/viewMode";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

import { buildHeaderNavList } from "@/data/headerNavList";
import HeaderNavigationItem from "./HeaderNavigationItem";

type HeaderNavigationProps = {
  viewMode: ViewMode;
};

export default function HeaderNavigation({ viewMode }: HeaderNavigationProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();
  const { profile } = useUserProfile();

  const items = useMemo(
    () =>
      buildHeaderNavList({
        viewMode,
        isAuthenticated,
        userRole: user?.role,
        isChildProfile: profile?.type === "CHILD",
      }),
    [viewMode, isAuthenticated, user?.role, profile?.type]
  );

  if (!items.length) return null;

  return (
    <nav className={styles.nav} aria-label={t("nav.main")}>
      {items.map((item) => (
        <HeaderNavigationItem
          key={item.key}
          label={t(item.labelKey)}
          onClick={() => router.push(item.href)}
          disabled={item.disabled}
        />
      ))}
    </nav>
  );
}