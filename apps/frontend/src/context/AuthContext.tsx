// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, JwtPayload, UserRole } from "@/types/auth";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { loginApi, registerApi } from "@/lib/api/auth.api";

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json as JwtPayload;
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false; // if exp missing, do not auto-expire
  return payload.exp * 1000 < Date.now();
}

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

  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;

  setTokenDirect: (token: string) => void; // helpful for testing
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const applyToken = (jwt: string) => {
    const payload = decodeJwt(jwt);
    if (!payload || isExpired(payload)) {
      tokenStorage.clear();
      setToken(null);
      setUser(null);
      return;
    }

    tokenStorage.set(jwt);
    setToken(jwt);
    setUser({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  };

  /* =========================
     BOOTSTRAP FROM STORAGE
  ========================= */
  useEffect(() => {
    const stored = tokenStorage.get();
    if (stored) {
      applyToken(stored);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  const login = async (input: LoginInput) => {
    const res = await loginApi(input);
    applyToken(res.access_token);
  };

  const register = async (input: RegisterInput) => {
    const res = await registerApi(input);
    applyToken(res.access_token);
  };

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
