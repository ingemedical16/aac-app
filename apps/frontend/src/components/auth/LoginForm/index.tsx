//src/components/auth/LoginForm/index.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPostLoginRedirect } from "@/lib/auth/postLoginRedirect";
import { useTranslation } from "react-i18next";
import styles from "./LoginForm.module.scss";

export default function LoginForm() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const search = useSearchParams();
  const next = search.get("next");

  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });

      const redirect = getPostLoginRedirect(
        locale,
        user!.role,
        next
      );

      router.replace(redirect);
    } catch {
      setError(t("auth.invalid_credentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>{t("auth.login")}</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("auth.email")}
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("auth.password")}
        required
      />

      {error && <p className={styles.error}>{error}</p>}

      <button disabled={loading}>
        {loading ? t("common.loading") : t("auth.login")}
      </button>
    </form>
  );
}