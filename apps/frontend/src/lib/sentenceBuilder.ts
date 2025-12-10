import type { TFunction } from "i18next";
import type { TileData } from "@/components/Tile";

type Locale = "en" | "fr" | "ar" | "ro" | string;

interface PhraseSet {
  iWant: string;
  iDontWant: string;
  iNeedHelp: string;
  help: string;
  iFeel: string;
  stop: string;
  more: string;
  again: string;
  to: string;
  toGoTo: string;
  period: string;
}

/**
 * Get phrases from i18n (common.json)
 *
 * Requires keys:
 * - iWant, iDontWant, iNeedHelp, help, iFeel
 * - stop, more, again, to, toGoTo, period
 */
function getPhrases(locale: Locale, t: TFunction<"common">): PhraseSet {
  // Use the existing translation system. If a key is missing,
  // t() will usually return the key itself, which is fine for now.
  return {
    iWant: t("iWant"),
    iDontWant: t("iDontWant"),
    iNeedHelp: t("iNeedHelp"),
    help: t("help"),
    iFeel: t("iFeel"),
    stop: t("stop"),
    more: t("more"),
    again: t("again"),
    to: t("to"),
    toGoTo: t("toGoTo"),
    period: t("period"),
  };
}

/**
 * Choose display text for a tile in a given locale
 */
function textForTile(tile: TileData, locale: Locale): string {
  return tile.translations?.[locale] || tile.word;
}

/**
 * Join tiles into a phrase string in the correct language
 */
function joinTiles(tiles: TileData[], locale: Locale): string {
  return tiles.map((t) => textForTile(t, locale)).join(" ");
}

/**
 * Helper: find a tile by its base English "word" field (case-insensitive)
 * This relies on your TileData.word values:
 *  - "I want"
 *  - "Don't want"
 *  - "Help"
 *  - "Stop"
 *  - "More"
 *  - "Again"
 */
function findByWord(tiles: TileData[], word: string): TileData | undefined {
  const lower = word.toLowerCase();
  return tiles.find((t) => t.word.toLowerCase() === lower);
}

/**
 * Grammar Engine v3
 *
 * - Uses i18n keys from common.json (multi-language).
 * - Uses AAC semantics: categories (food, drink, people, feelings, actions, help).
 * - Stays simple and predictable for children / therapists.
 */
export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  t: TFunction<"common">
): string {
  if (!tiles.length) return "";

  const phrases = getPhrases(locale, t);

  // Clean up / copy array to avoid mutating callers
  const allTiles = [...tiles];

  // --- Semantic groups by category ---
  const byCategory = (category: string) =>
    allTiles.filter((tile) => tile.category === category);

  const feelings = byCategory("feelings");
  const actions = byCategory("actions");
  const food = byCategory("food");
  const drink = byCategory("drink");
  const people = byCategory("people");

  // --- Special “word” tiles (control tiles) ---
  const wantTile = findByWord(allTiles, "I want");
  const dontWantTile = findByWord(allTiles, "Don't want");
  const helpTile = findByWord(allTiles, "Help");
  const stopTile = findByWord(allTiles, "Stop");
  const moreTile = findByWord(allTiles, "More");
  const againTile = findByWord(allTiles, "Again");

  // Tiles used as modifiers ("More", "Again") should not be the main content
  const modifierSet = new Set<TileData>();
  if (moreTile) modifierSet.add(moreTile);
  if (againTile) modifierSet.add(againTile);

  // --- Used later as emphasis at the end ---
  const extraWords: string[] = [];
  if (moreTile) extraWords.push(phrases.more);
  if (againTile) extraWords.push(phrases.again);

  // Helper: tiles except some
  const except = (toRemove: TileData[] = []) => {
    const set = new Set(toRemove);
    return allTiles.filter((t) => !set.has(t) && !modifierSet.has(t));
  };

  // --------------------------------------------------
  // 1) Feelings-only / feelings-dominant → "I feel happy."
  // --------------------------------------------------
  const hasCoreControlTiles = !!(wantTile || dontWantTile || helpTile);
  if (feelings.length && !hasCoreControlTiles && allTiles.length === feelings.length) {
    const feelingsText = joinTiles(feelings, locale);
    // "I feel happy / Je me sens triste / أشعر أنني سعيد"
    const base = phrases.iFeel || "I feel";
    return `${base} ${feelingsText}${phrases.period}`;
  }

  // --------------------------------------------------
  // 2) Explicit "Help"
  // --------------------------------------------------
  if (helpTile) {
    const others = except([helpTile]);

    // If only "Help" tile → "Help!"
    if (!others.length) {
      // let translation handle it (e.g. "Aide", "مساعدة")
      const helpWord = phrases.help || textForTile(helpTile, locale);
      return `${helpWord}!`;
    }

    // Else → "I need help sit." / "I need help water."
    const targetText = joinTiles(others, locale);
    const base = phrases.iNeedHelp || "I need help";
    return `${base} ${targetText}${phrases.period}`;
  }

  // --------------------------------------------------
  // 3) STOP-only request
  // --------------------------------------------------
  if (stopTile && allTiles.length === 1) {
    const stopWord = phrases.stop || textForTile(stopTile, locale);
    return `${stopWord}${phrases.period}`;
  }

  // --------------------------------------------------
  // 4) Build "want / don't want" logic
  // --------------------------------------------------
  const wantableTiles = [
    ...food,
    ...drink,
    ...people,
    ...actions,
    ...feelings,
  ].filter((tile, index, self) => self.indexOf(tile) === index);

  let base: string;
  let hasExplicitWant = !!wantTile || !!dontWantTile;

  if (dontWantTile) {
    base = phrases.iDontWant || "I don't want";
  } else if (wantTile) {
    base = phrases.iWant || "I want";
  } else {
    // No explicit "I want" tile:
    // If the child chooses something “wantable”, we implicitly prepend "I want / Je veux / أريد / Vreau".
    if (wantableTiles.length) {
      base = phrases.iWant || "I want";
      hasExplicitWant = false;
    } else {
      // Fallback: just read selected tiles in order
      const raw = joinTiles(except(), locale);
      return raw ? `${raw}${phrases.period}` : "";
    }
  }

  // --------------------------------------------------
  // 5) Build main content of sentence
  // --------------------------------------------------
  const contentTiles = except([wantTile, dontWantTile].filter(Boolean) as TileData[]);

  const actionsOnly = actions.filter((t) => contentTiles.includes(t));
  const foodAndDrink = [...food, ...drink].filter((t) => contentTiles.includes(t));
  const peopleOnly = people.filter((t) => contentTiles.includes(t));

  let restParts: string[] = [];

  // --- Actions (sit, go, come, stand...) ---
  if (actionsOnly.length) {
    const goAction = actionsOnly.find((a) => a.word.toLowerCase() === "go");

    if (goAction && peopleOnly.length) {
      // e.g. "I want to go to mom."
      const peopleText = joinTiles(peopleOnly, locale);

      if (phrases.toGoTo) {
        restParts.push(`${phrases.toGoTo} ${peopleText}`);
      } else if (phrases.to) {
        // fallback if toGoTo empty but "to" exists
        const goText = textForTile(goAction, locale);
        restParts.push(`${phrases.to} ${goText} ${peopleText}`);
      } else {
        // bare: "go mom"
        const goText = textForTile(goAction, locale);
        restParts.push(`${goText} ${peopleText}`);
      }
    } else {
      // General actions: "I want to sit", "I want to go"
      const actionsText = joinTiles(actionsOnly, locale);
      if (phrases.to) {
        restParts.push(`${phrases.to} ${actionsText}`);
      } else {
        // languages where we don't use "to" before verbs
        restParts.push(actionsText);
      }
    }
  }

  // --- Objects: food, drink / people as things we want ---
  if (foodAndDrink.length || (!actionsOnly.length && peopleOnly.length)) {
    const objects = [
      ...foodAndDrink,
      ...(!actionsOnly.length ? peopleOnly : []),
    ];
    const objectsText = joinTiles(objects, locale);

    if (actionsOnly.length) {
      // attach to verb: "I want to drink water"
      restParts.push(objectsText);
    } else {
      // pure object: "I want water."
      restParts.push(objectsText);
    }
  }

  // --- If nothing meaningful built → fallback ---
  let sentence: string;

  if (!restParts.length) {
    const filtered = contentTiles;
    const raw = joinTiles(filtered, locale);

    if (!raw) {
      // If still nothing, just speak everything selected
      const fallback = joinTiles(allTiles, locale);
      return fallback ? `${fallback}${phrases.period}` : "";
    }

    sentence = hasExplicitWant ? `${base} ${raw}`.trim() : raw;
  } else {
    sentence = `${base} ${restParts.join(" ")}`.trim();
  }

  // --- Add "more / again" emphasis at the end ---
  if (extraWords.length) {
    sentence = `${sentence} ${extraWords.join(" ")}`.trim();
  }

  // Final punctuation
  return `${sentence}${phrases.period}`;
}
