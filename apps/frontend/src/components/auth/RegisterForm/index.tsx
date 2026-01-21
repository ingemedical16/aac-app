"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ALLOWED_ROLES: UserRole[] = ["USER", "PROFESSIONAL"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        email,
        password,
        role,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>{t("auth.register")}</h1>

      {/* Role */}
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

      {/* First name */}
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder={t("auth.first_name")}
        autoComplete="given-name"
        required
      />

      {/* Last name */}
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder={t("auth.last_name")}
        autoComplete="family-name"
        required
      />

      {/* Email */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("auth.email")}
        autoComplete="email"
        required
      />

      {/* Password */}
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
