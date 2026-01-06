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

  setTokenDirect: (token: string) => AuthUser; // helpful for testing
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
 

  const clearAuth = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  const applyToken = (jwt: string): AuthUser => {
    const payload = decodeJwt(jwt);

    if (!payload || isExpired(payload) || !payload.sub || !payload.email || !payload.role) {
      clearAuth();
      throw new Error("auth.invalid_token");
    }

    const nextUser: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      // Optional claims (support both “now” and “later” backend shapes)
      isPatient: (payload as any).isPatient ?? undefined,
      children: (payload as any).children ?? undefined,
    };

    tokenStorage.set(jwt);
    setToken(jwt);
    setUser(nextUser);

    return nextUser;
  };

  useEffect(() => {
    const stored = tokenStorage.get();
    if (stored) {
      try {
        applyToken(stored);
      } catch {
        // token invalid/expired -> cleared already
      }
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => clearAuth();

  const login = async (input: LoginInput) => {
    const res = await loginApi(input);
    return applyToken(res.access_token);
  };

  const register = async (input: RegisterInput) => {
    const res = await registerApi(input);
    return applyToken(res.access_token);
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
   const { t } = useTranslation();
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(t("errors.auth.missingProvider")); // ✅ translate key
  return ctx;
}