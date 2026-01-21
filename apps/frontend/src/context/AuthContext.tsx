"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AuthUser,
  JwtPayload,
  LoginInput,
  RegisterInput,
} from "@/types/auth";

import { tokenStorage } from "@/lib/auth/tokenStorage";
import { loginApi, registerApi } from "@/lib/api/auth.api";
import { throwI18nError } from "@/helpers/throwI18nError";

/* =========================
   JWT HELPERS
========================= */

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as JwtPayload;
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}

/* =========================
   CONTEXT TYPES
========================= */

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
   * Returns AuthUser or null
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
     BOOTSTRAP SESSION
  ========================= */

  useEffect(() => {
    const stored = tokenStorage.get();
    if (stored) {
      applyToken(stored);
    }
    setIsReady(true);
  }, []);

  /* =========================
     AUTH ACTIONS
  ========================= */

  const login = async (input: LoginInput): Promise<AuthUser> => {
    const res = await loginApi(input);
    const u = applyToken(res.access_token);

    if (!u) {
      throwI18nError("errors.auth.tokenInvalid");
    }

    return u;
  };

  const register = async (input: RegisterInput): Promise<AuthUser> => {
    const res = await registerApi(input);
    const u = applyToken(res.access_token);

    if (!u) {
      throwI18nError("errors.auth.tokenInvalid");
    }

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
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throwI18nError("errors.auth.missingProvider");
  }

  return ctx;
}
