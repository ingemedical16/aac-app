"use client";

import styles from "./ Aside.module.scss";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { tx } from "@/lib/i18n/tx";
import { withLocale } from "@/lib/navigation/withLocale";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";

import { ViewMode } from "@/types/viewMode";
import type { UserRole } from "@/types/auth";

/* =========================
   TYPES
========================= */

export type AsideProps = {
  viewMode: ViewMode;
  isMobile?: boolean;
  onClose?: () => void;
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  roles?: UserRole[];
};

/* =========================
   COMPONENT
========================= */

export default function Aside({
  viewMode,
  isMobile = false,
  onClose,
}: AsideProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "en";

  const { user } = useAuth();
  const { profiles, activeProfileId, setActiveProfileId } = useUserProfile();

  /* =========================
     DASHBOARD ONLY
  ========================= */

  if (viewMode !== ViewMode.DASHBOARD) {
    return null;
  }

  /* =========================
     NAVIGATION
  ========================= */

  const navItems: NavItem[] = useMemo(() => {
    const userDashboard = withLocale(locale, "/user/dashboard");
    const professionalDashboard = withLocale(locale, "/professional/dashboard");
    const adminPanel = withLocale(locale, "/admin");

    const items: NavItem[] = [
      {
        key: "user.home",
        label: t(tx("common", "aside.userDashboard")),
        href: userDashboard,
        roles: ["USER"],
      },
      {
        key: "user.profiles",
        label: t(tx("common", "aside.profiles")),
        href: `${userDashboard}?tab=profiles`,
        roles: ["USER"],
      },
      {
        key: "user.settings",
        label: t(tx("common", "aside.settings")),
        href: `${userDashboard}?tab=settings`,
        roles: ["USER"],
      },
      {
        key: "professional.home",
        label: t(tx("common", "aside.professionalDashboard")),
        href: professionalDashboard,
        roles: ["PROFESSIONAL"],
      },
      {
        key: "admin.home",
        label: t(tx("common", "aside.adminPanel")),
        href: adminPanel,
        roles: ["ADMIN"],
      },
      {
        key: "board",
        label: t(tx("common", "aside.goToBoard")),
        href: withLocale(locale, "/board"),
        roles: ["USER", "PROFESSIONAL", "ADMIN"],
      },
    ];

    const role = user?.role;
    if (!role) return [];

    return items.filter((i) => !i.roles || i.roles.includes(role));
  }, [t, locale, user?.role]);

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose?.();
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <aside
      className={`${styles.aside} ${
        isMobile ? styles.mobile : styles.desktop
      }`}
      aria-label={t(tx("common", "aside.label"))}
    >
      {/* Mobile close */}
      {isMobile && onClose && (
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t(tx("common", "aside.close"))}
        >
          ✕
        </button>
      )}

      {/* NAVIGATION */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {t(tx("common", "aside.navigation"))}
        </div>

        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={styles.navItem}
                onClick={() => handleNavigate(item.href)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.divider} />

      {/* PROFILES */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {t(tx("common", "aside.activeProfile"))}
        </div>

        {!profiles?.length ? (
          <p className={styles.muted}>
            {t(tx("common", "aside.noProfiles"))}
          </p>
        ) : (
          <ul className={styles.profileList}>
            {profiles.map((p) => {
              const active = p.id === activeProfileId;

              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`${styles.profileItem} ${
                      active ? styles.active : ""
                    }`}
                    onClick={() => {
                      setActiveProfileId(p.id);
                      onClose?.();
                    }}
                  >
                    <span className={styles.profileName}>{p.name}</span>
                    <span className={styles.profileMeta}>
                      {p.type === "CHILD"
                        ? t(tx("common", "profile.typeChild"))
                        : t(tx("common", "profile.typeIndividual"))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}