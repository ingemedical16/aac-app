import { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18n/config";

/* =========================
   ROUTE DEFINITIONS
========================= */

// Paths AFTER locale
const PUBLIC_ROUTES = [
  "",            // /
  "/login",
  "/register",
  "/about",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/parent",
  "/pro",
  "/board",
];

/* =========================
   MIDDLEWARE
========================= */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Always let i18n-router resolve locale first
  const i18nResponse = i18nRouter(request, i18nConfig);

  // If i18nRouter decided to redirect → stop here
  if (i18nResponse) {
    return i18nResponse;
  }

  // 2️⃣ Extract locale + path
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return NextResponse.next();
  }

  const locale = segments[0];
  const pathAfterLocale = "/" + segments.slice(1).join("/");

  // 3️⃣ Read JWT (cookie-based)
  const token = request.cookies.get("access_token")?.value;

  const isPublic = PUBLIC_ROUTES.some(
    (route) =>
      pathAfterLocale === route ||
      pathAfterLocale.startsWith(route + "/")
  );

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathAfterLocale.startsWith(route)
  );

  // 4️⃣ Block unauthenticated access
  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }

  // 5️⃣ Prevent logged users from visiting auth pages
  if (
    token &&
    (pathAfterLocale === "/login" ||
      pathAfterLocale === "/register")
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.url)
    );
  }

  return NextResponse.next();
}

/* =========================
   CONFIG
========================= */

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};