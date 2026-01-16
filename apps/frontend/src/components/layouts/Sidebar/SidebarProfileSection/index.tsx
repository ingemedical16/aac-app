"use client";

import { useRouter } from "next/navigation";
import styles from "./SidebarProfileSection.module.scss";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

type SidebarProfileSectionProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export default function SidebarProfileSection({
  collapsed = false,
  onNavigate,
}: SidebarProfileSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation();

  if (!isAuthenticated || !profile) return null;

  const avatarUrl = profile.avatarUrl;
  const displayName = profile.name;
  const initial = displayName?.charAt(0)?.toUpperCase() ?? "?";

  const handleClick = () => {
    router.push("/dashboard?tab=profiles");
    onNavigate?.();
  };

  return (
    <button
      type="button"
      className={[
        styles.root,
        collapsed ? styles.collapsed : "",
      ].join(" ")}
      onClick={handleClick}
      aria-label={t(tx("common", "sidebar.profile"))}
    >
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="" />
        ) : (
          <span className={styles.initial}>{initial}</span>
        )}
      </div>

      {!collapsed && (
        <div className={styles.info}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.meta}>
            {profile.type === "CHILD"
              ? t(tx("common", "profile.typeChild"))
              : t(tx("common", "profile.typeIndividual"))}
          </div>
        </div>
      )}
    </button>
  );
}