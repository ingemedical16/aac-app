// src/lib/sentenceBuilder.ts
import type { TileData } from "@/types/tile";
import type { LocaleCode } from "@/types/userProfile";
import i18next from "i18next";
import { SEMANTIC } from "@/lib/ai/semantic";
import { tx } from "@/lib/i18n/tx";

/* =========================
   HELPERS
========================= */

const t = (key: string, locale: LocaleCode) =>
  i18next.getFixedT(locale)(key);

const tileLabel = (tile: TileData, locale: LocaleCode) =>
  t(tx("tiles", tile.translateKey), locale);

/* =========================
   MAIN
========================= */

export function buildSentence(
  tiles: TileData[],
  locale: LocaleCode
): string {
  if (!tiles.length) return "";

  /* -------- FEELINGS -------- */
  const feeling = tiles.find(t =>
    t.semantic?.startsWith("semantic.feeling.")
  );

  if (feeling && tiles.length === 1) {
    return `${t("sentence.iFeel", locale)} ${tileLabel(feeling, locale)}`;
  }

  /* -------- WANT / DONT WANT -------- */
  const want = tiles.some(t => t.semantic === SEMANTIC.WANT);
  const dontWant = tiles.some(t => t.semantic === SEMANTIC.DONT_WANT);

  const objects = tiles.filter(
    t => !t.semantic || !t.semantic.startsWith("semantic.")
  );

  let sentence = dontWant
    ? t("semantic.dont_want", locale)
    : t("semantic.want", locale);

  if (objects.length) {
    sentence += " " + objects.map(o => tileLabel(o, locale)).join(" ");
  }

  /* -------- MODIFIERS -------- */
  if (tiles.some(t => t.semantic === SEMANTIC.MORE)) {
    sentence += " " + t("semantic.more", locale);
  }

  if (tiles.some(t => t.semantic === SEMANTIC.AGAIN)) {
    sentence += " " + t("semantic.again", locale);
  }

  return sentence.trim();
}