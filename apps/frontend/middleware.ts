import { NextRequest, NextResponse } from "next/server";

/* =========================
   ROUTE DEFINITIONS
========================= */

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/board",
];

/* =========================
   MIDDLEWARE
========================= */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files & Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read JWT from cookie
  const token = request.cookies.get("access_token")?.value;

  const isPublic = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  /* =========================
     BLOCK UNAUTHENTICATED
  ========================= */

  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  /* =========================
     BLOCK AUTH PAGES IF LOGGED
  ========================= */

  if (
    token &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

/* =========================
   CONFIG
========================= */

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
