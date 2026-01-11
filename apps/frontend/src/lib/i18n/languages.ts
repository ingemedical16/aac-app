// src/lib/i18n/languages.ts

export type LocaleCode = "en" | "fr" | "ar" | "ro" | (string & {});
/**
 * Supported locales for the application.
 * Can later be hydrated from ENV or backend.
 */
export const SUPPORTED_LANGUAGES = (
  process.env.NEXT_PUBLIC_LANGUAGES?.split(",") ??
  ["en", "fr", "ar", "ro"]
) as readonly string[];

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];


export const DEFAULT_LANGUAGE: SupportedLanguage =
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? "en";

export function isSupportedLanguage(
  lang: string
): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang);
}