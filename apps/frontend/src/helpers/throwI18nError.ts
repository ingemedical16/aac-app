import { I18nNamespace, tx } from "@/lib/i18n/tx";
import i18next from "i18next";

/**
 * Throws a translated Error using i18n keys
 *
 * Example:
 *   throwI18nError("auth", "invalid_credentials");
 */
export function throwI18nError(key: string, namespace: I18nNamespace = "common"): never {
  const message = i18next.t(tx(namespace, key));
  throw new Error(message);
}
