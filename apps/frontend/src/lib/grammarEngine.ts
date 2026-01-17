// src/lib/grammarEngine.ts
import type { TileData } from "@/types/tile";

import {
  SEMANTIC,
  isFeelingSemantic,
  isActionSemantic,
  isModifierSemantic,
  isQuantitySemantic,
} from "@/lib/ai/semantic";
import i18next from "i18next";
import { LocaleCode } from "./i18n/languages";

/* ---------------------------------------------
   SEMANTIC GRAMMAR ENGINE
   - translateKey based
   - locale agnostic logic
--------------------------------------------- */

export function buildSmartSentence(
  tiles: TileData[],
  locale: LocaleCode
): string {
  if (!tiles.length) return "";

  const t = i18next.getFixedT(locale, "common");

  /* ---------------------------------------------
     CLASSIFY TILES BY SEMANTIC
  --------------------------------------------- */
  const feelings = tiles.filter((t) => isFeelingSemantic(t.semantic));
  const actions = tiles.filter((t) => isActionSemantic(t.semantic));
  const modifiers = tiles.filter((t) => isModifierSemantic(t.semantic));
  const quantities = tiles.filter((t) => isQuantitySemantic(t.semantic));

  const wants = tiles.find((t) => t.semantic === SEMANTIC.WANT);
  const dontWants = tiles.find((t) => t.semantic === SEMANTIC.DONT_WANT);
  const help = tiles.find((t) => t.semantic === SEMANTIC.HELP);
  const stop = tiles.find((t) => t.semantic === SEMANTIC.STOP);

  const objects = tiles.filter(
    (t) =>
      !t.semantic ||
      (!isFeelingSemantic(t.semantic) &&
        !isActionSemantic(t.semantic) &&
        !isModifierSemantic(t.semantic) &&
        !isQuantitySemantic(t.semantic))
  );

  /* ---------------------------------------------
     1) FEELINGS ONLY
     → “I feel happy / sad”
  --------------------------------------------- */
  if (feelings.length && tiles.length === feelings.length) {
    return (
      `${t("sentence.iFeel")} ` +
      feelings.map((f) => t(f.translateKey)).join(" ") +
      t("sentence.period")
    );
  }

  /* ---------------------------------------------
     2) HELP
     → “I need help” / “I need help bread”
  --------------------------------------------- */
  if (help) {
    if (!objects.length) {
      return t("sentence.iNeedHelp") + t("sentence.period");
    }

    return (
      `${t("sentence.iNeedHelp")} ` +
      objects.map((o) => t(o.translateKey)).join(" ") +
      t("sentence.period")
    );
  }

  /* ---------------------------------------------
     3) STOP (single)
     → “Stop.”
  --------------------------------------------- */
  if (stop && tiles.length === 1) {
    return t("sentence.stop") + t("sentence.period");
  }

  /* ---------------------------------------------
     4) WANT / DON'T WANT
     → “I want bread”
     → “I don’t want juice”
  --------------------------------------------- */
  if (wants || dontWants) {
    const base = wants
      ? t("sentence.iWant")
      : t("sentence.iDontWant");

    let sentence = base;

    if (actions.length) {
      sentence +=
        " " +
        t("sentence.to") +
        " " +
        actions.map((a) => t(a.translateKey)).join(" ");
    }

    if (objects.length) {
      sentence += " " + objects.map((o) => t(o.translateKey)).join(" ");
    }

    if (quantities.length) {
      sentence += " " + quantities.map((q) => t(q.translateKey)).join(" ");
    }

    if (modifiers.length) {
      sentence += " " + modifiers.map((m) => t(m.translateKey)).join(" ");
    }

    return sentence.trim() + t("sentence.period");
  }

  /* ---------------------------------------------
     5) FALLBACK
     → join translated tiles
  --------------------------------------------- */
  const text = tiles.map((tile) => t(tile.translateKey)).join(" ");

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1) +
    t("sentence.period")
  );
}
