// src/lib/auth/bearerTokenStorage.ts
// ⚠️ NOT USED IN BROWSER AUTH
// Only for non-cookie environments (mobile / CLI)

const TOKEN_KEY = "aac.bearer.jwt";

export const bearerTokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
