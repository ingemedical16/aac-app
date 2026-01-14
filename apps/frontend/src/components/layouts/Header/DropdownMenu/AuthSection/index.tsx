"use client";

import styles from "./AuthSection.module.scss";
import DropdownItem from "../DropdownItem";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

type AuthSectionProps = {
  onAnyAction: () => void;
};

export default function AuthSection({ onAnyAction }: AuthSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className={styles.section}>
        <DropdownItem
          label={t(tx("common", "auth.login"))}
          onClick={() => {
            router.push("/login");
            onAnyAction();
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <DropdownItem
        label={t(tx("common", "auth.logout"))}
        onClick={() => {
          logout();
          onAnyAction();
        }}
      />
    </div>
  );
}