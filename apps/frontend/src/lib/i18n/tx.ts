/**
 * Translation key helper
 * Builds namespaced i18n keys in a safe and explicit way.
 *
 * Example:
 *   tx("tiles", "tile.food.bread") → "tiles:tile.food.bread"
 */
export type I18nNamespace =
  | "common"
  | "tiles"
  | "categories"
  | "groups"
  | "semantic";

export function tx(
  namespace: I18nNamespace,
  key: string
): `${I18nNamespace}:${string}` {
  return `${namespace}:${key}` as const;
}