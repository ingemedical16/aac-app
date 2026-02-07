"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";

import { loginApi, registerApi, logoutApi, meApi } from "@/lib/api/auth.api";
import { throwI18nError } from "@/helpers/throwI18nError";

interface AuthContextValue {
  isReady: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;

  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;

  // Optional helpers
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapMeToAuthUser(me: any): AuthUser {
  // Adjust mapping if your /auth/me shape differs
  return {
    id: me.id,
    email: me.email,
    role: me.role,
    profileId: me.profileId ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshMe = async () => {
    try {
      const me = await meApi<any>();
      setUser(mapMeToAuthUser(me));
    } catch (err: any) {
      // Not logged in (401) or cookie missing -> treat as logged out
      setUser(null);
    } finally {
      setIsReady(true);
    }
  };

  // Bootstrap session from HttpOnly cookie
  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (input: LoginInput): Promise<AuthUser> => {
    try {
      await loginApi(input); // backend sets cookie
      const me = await meApi<any>();
      const nextUser = mapMeToAuthUser(me);
      setUser(nextUser);
      return nextUser;
    } catch (e) {
      throwI18nError("errors.auth.loginFailed");
    }
  };

  const register = async (input: RegisterInput): Promise<AuthUser> => {
    try {
      await registerApi(input); // backend sets cookie
      const me = await meApi<any>();
      const nextUser = mapMeToAuthUser(me);
      setUser(nextUser);
      return nextUser;
    } catch (e) {
      throwI18nError("errors.auth.registerFailed");
    }
  };

  const logout = async () => {
    try {
      await logoutApi(); // backend clears cookie
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated: !!user,
      user,
      login,
      register,
      logout,
      refreshMe,
    }),
    [isReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throwI18nError("errors.auth.missingProvider");
  }
  return ctx;
}
