/**
 * Prefixes a route with the active locale.
 *
 * Examples:
 *   withLocale("en", "/admin")  → "/en/admin"
 *   withLocale("fr", "board")   → "/fr/board"
 */
export function withLocale(locale: string, path: string) {
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}