//src/components/auth/RegisterForm/index.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPostLoginRedirect } from "@/lib/auth/postLoginRedirect";
import type { UserRole } from "@/types/auth";
import styles from "./RegisterForm.module.scss";

const ALLOWED_ROLES: UserRole[] = [
  "PARENT",
  "PROFESSIONAL",
  "PATIENT_ADULT",
];

export default function RegisterForm() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { register, user } = useAuth();

  const [role, setRole] = useState<UserRole>("PARENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await register({ email, password, role });

    const redirect = getPostLoginRedirect(locale, user!.role);
    router.replace(redirect);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Register</h1>

      <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
        {ALLOWED_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Create account</button>
    </form>
  );
}