"use client";

import styles from "./HeaderNavigation.module.scss";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ViewMode } from "@/types/viewMode";
import { useAuth } from "@/context/AuthContext";
import HeaderNavigationItem from "./HeaderNavigationItem";

type HeaderNavigationProps = {
  viewMode: ViewMode;
};

export default function HeaderNavigation({ viewMode }: HeaderNavigationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const items = useMemo(() => {
    // PUBLIC (Home, About, Contact, Help)
    if (viewMode === ViewMode.PUBLIC) {
      return [
        { key: "home", label: t("nav.home"), href: "/" },
        { key: "about", label: t("nav.about"), href: "/about" },
        { key: "contact", label: t("nav.contact"), href: "/contact" },
        { key: "help", label: t("nav.help"), href: "/help" },
        {key: "privacy", label: t("nav.privacy"), href: "/privacy" },
        { key: "terms", label: t("nav.terms"), href: "/terms" }
      ];
    }

    // BOARD
    if (viewMode === ViewMode.BOARD) {
      return [
        { key: "board", label: t("nav.board"), href: "/board" },
        ...(isAuthenticated
          ? [{ key: "dashboard", label: t("nav.dashboard"), href: "/dashboard" }]
          : []),
      ];
    }

    // DASHBOARD
    if (viewMode === ViewMode.DASHBOARD && user) {
      return [
        { key: "dashboard", label: t("nav.dashboard"), href: "/dashboard" },
        { key: "profiles", label: t("nav.profiles"), href: "/dashboard?tab=profiles" },
        { key: "settings", label: t("nav.settings"), href: "/dashboard?tab=settings" },
      ];
    }

    return [];
  }, [viewMode, user, isAuthenticated, t]);

  if (!items.length) return null;

  return (
    <nav className={styles.nav} aria-label={t("nav.main")}>
      {items.map((item) => (
        <HeaderNavigationItem
          key={item.key}
          label={item.label}
          onClick={() => router.push(item.href)}
        />
      ))}
    </nav>
  );
}