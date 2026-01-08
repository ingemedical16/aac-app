// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser, JwtPayload, UserRole } from "@/types/auth";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { loginApi, registerApi } from "@/lib/api/auth.api";
import { useTranslation } from "react-i18next";

/* =========================
   JWT HELPERS
========================= */

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return json as JwtPayload;
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}

/* =========================
   TYPES
========================= */

type RegisterInput = {
  email: string;
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

interface AuthContextValue {
  isReady: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;

  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;

  setTokenDirect: (token: string) => AuthUser | null;
}

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextValue | null>(null);

/* =========================
   PROVIDER
========================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  /**
   * Apply JWT → state
   * Returns the created AuthUser (important for redirects)
   */
  const applyToken = (jwt: string): AuthUser | null => {
    const payload = decodeJwt(jwt);

    if (!payload || isExpired(payload)) {
      tokenStorage.clear();
      setToken(null);
      setUser(null);
      return null;
    }

    const nextUser: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      profileId: payload.profileId ?? null,
    };

    tokenStorage.set(jwt);
    setToken(jwt);
    setUser(nextUser);

    return nextUser;
  };

  /* =========================
     BOOTSTRAP (on refresh)
  ========================= */
  useEffect(() => {
    const stored = tokenStorage.get();
    if (stored) {
      applyToken(stored);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     AUTH ACTIONS
  ========================= */

  const login = async (input: LoginInput): Promise<AuthUser> => {
    const res = await loginApi(input);
    const { t } = useTranslation();
    const u = applyToken(res.access_token);
    if (!u) throw new Error(t("errors.auth.tokenInvalid"));
    return u;
  };

  const register = async (input: RegisterInput): Promise<AuthUser> => {
    const res = await registerApi(input);
    const { t } = useTranslation();
    const u = applyToken(res.access_token);
    if (!u) throw new Error(t("errors.auth.tokenInvalid"));
    return u;
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated: !!user,
      token,
      user,
      login,
      register,
      logout,
      setTokenDirect: applyToken,
    }),
    [isReady, token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {
  const { t } = useTranslation();
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(t("errors.auth.missingProvider"));
  }
  return ctx;
}