"use client";

import styles from "./SidebarFooter.module.scss";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";
import { renderNavIcon } from "@/components/icons";


type SidebarFooterProps = {
  collapsed?: boolean;
  onLogout?: () => void;
};

export default function SidebarFooter({
  collapsed = false,
  onLogout,
}: SidebarFooterProps) {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div
      className={[
        styles.root,
        collapsed ? styles.collapsed : "",
      ].join(" ")}
    >
      <button
        type="button"
        className={styles.logout}
        onClick={handleLogout}
        aria-label={t(tx("common", "auth.logout"))}
      >
        <span className={styles.icon}>
          {renderNavIcon("logout")}
        </span>

        {!collapsed && (
          <span className={styles.label}>
            {t(tx("common", "auth.logout"))}
          </span>
        )}
      </button>

      {!collapsed && (
        <div className={styles.meta}>
          AAC ©️ {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}