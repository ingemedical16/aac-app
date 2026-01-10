"use client";

import styles from "./Header.module.scss";

import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";
import { withLocale } from "@/lib/navigation/withLocale";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ViewMode } from "@/types/viewMode";

type HeaderProps = {
  viewMode: ViewMode;
  onOpenAside?: () => void;

  /**
   * AppShell decides when to show it.
   * Your desired behavior:
   * - Mobile: burger visible, header content visible (optional)
   * - Desktop: burger hidden
   */
  showBurger?: boolean;
};

export default function Header({
  viewMode,
  onOpenAside,
  showBurger = false,
}: HeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "en";

  const { isAuthenticated, user, logout } = useAuth();
  const { profile } = useUserProfile();

  const title = useMemo(() => {
    switch (viewMode) {
      case ViewMode.DASHBOARD:
        return t(tx("common", "header.dashboardTitle"));
      case ViewMode.BOARD:
        return t(tx("common", "header.boardTitle"));
      case ViewMode.PUBLIC:
      default:
        return t(tx("common", "header.publicTitle"));
    }
  }, [t, viewMode]);

  const subtitle = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    return profile?.name || user.email;
  }, [isAuthenticated, user, profile?.name]);

  const handleLogout = () => {
    logout();
    router.replace(withLocale(locale, "/login"));
  };

  const quickNav = useMemo(() => {
    if (!isAuthenticated) return null;

    if (viewMode === ViewMode.DASHBOARD) {
      return {
        label: t(tx("common", "header.goToBoard")),
        href: withLocale(locale, "/board"),
      };
    }

    if (viewMode === ViewMode.BOARD) {
      return {
        label: t(tx("common", "header.goToDashboard")),
        href: withLocale(locale, "/user/dashboard"),
      };
    }

    return null;
  }, [isAuthenticated, viewMode, t, locale]);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.left}>
        {showBurger && onOpenAside && (
          <button
            type="button"
            className={styles.burger}
            onClick={onOpenAside}
            aria-label={t(tx("common", "header.openMenu"))}
          >
            ☰
          </button>
        )}

        <button
          type="button"
          className={styles.brand}
          onClick={() => router.push(`/${locale}`)}
        >
          <span className={styles.logo} aria-hidden="true">
            AAC
          </span>
          <span className={styles.brandText}>
            <span className={styles.title}>{title}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </span>
        </button>
      </div>

      <div className={styles.right}>
        {quickNav && (
          <button
            type="button"
            className={styles.quickNav}
            onClick={() => router.push(quickNav.href)}
          >
            {quickNav.label}
          </button>
        )}

        <LanguageSwitcher />

        {isAuthenticated && user ? (
          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
          >
            {t(tx("common", "auth.logout"))}
          </button>
        ) : (
          <div className={styles.authLinks}>
            {!pathname?.includes("/login") && (
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => router.push(withLocale(locale, "/login"))}
              >
                {t(tx("common", "auth.login"))}
              </button>
            )}
            {!pathname?.includes("/register") && (
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => router.push(withLocale(locale, "/register"))}
              >
                {t(tx("common", "auth.register"))}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}