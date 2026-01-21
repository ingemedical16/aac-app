// src/components/auth/RegisterForm/index.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";
import { useTranslation } from "react-i18next";
import AuthToggle from "@/components/auth/AuthToggle";
import styles from "./RegisterForm.module.scss";


export default function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const ALLOWED_ROLES: UserRole[] = ["USER", "PROFESSIONAL"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await register({ email, password, role });
    router.replace("/dashboard");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>{t("auth.register")}</h1>

      <label>
        {t("auth.role")}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          {ALLOWED_ROLES.map((r) => (
            <option key={r} value={r}>
              {t(`auth.roles.${r.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </label>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("auth.email")}
        autoComplete="email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("auth.password")}
        autoComplete="new-password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? t("loading") : t("auth.create_account")}
      </button>
      <AuthToggle />
    </form>
  );
}