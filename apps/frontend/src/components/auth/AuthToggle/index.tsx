// src/components/auth/AuthToggle/index.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import styles from "./AuthToggle.module.scss";
import { withLocale } from "@/lib/navigation/withLocale";

export default function AuthToggle() {
  const { t } = useTranslation("common");
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const isLogin = pathname?.includes("/login");

  const targetPath = isLogin ? "/register" : "/login";
  const label = isLogin
    ? t("auth.noAccount")
    : t("auth.haveAccount");

  const action = isLogin
    ? t("auth.register")
    : t("auth.login");

  return (
    <div className={styles.toggle}>
      <span>{label}</span>
      <Link href={targetPath}>
        {action}
      </Link>
    </div>
  );
}