import { TileData } from "@/components/Tile";

/**
 * Shared Grammar Types
 */

export type Locale = "en" | "fr" | "ar" | "ro" | (string & {});
export type GrammarMode = "simple" | "full";

export interface PhraseSet {
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

interface SentenceContext {
  tiles: TileData[];
  locale: Locale;
  phrases: PhraseSet;
  mode: GrammarMode;
}

/**
 * Helpers
 */

function textForTile(tile: TileData, locale: Locale): string {
  return tile.translations?.[locale] || tile.word;
}

function joinTiles(tiles: TileData[], locale: Locale): string {
  return tiles.map((t) => textForTile(t, locale)).join(" ");
}

function byCategory(tiles: TileData[], category: string): TileData[] {
  return tiles.filter((t) => t.category === category);
}

function findByWord(tiles: TileData[], word: string): TileData | undefined {
  return tiles.find((t) => t.word.toLowerCase() === word.toLowerCase());
}

/**
 * Core engine (language-agnostic, driven by PhraseSet)
 *
 * This is our "plugin-ready" base:
 * - All language specifics come from PhraseSet (i18n) and, later, optional per-language hooks.
 */

function buildFromContext(ctx: SentenceContext): string {
  const { tiles, locale, phrases } = ctx;

  if (!tiles.length) return "";

  // --- Categorization ---
  const feelings = byCategory(tiles, "feelings");
  const actions = byCategory(tiles, "actions");
  const foodAndDrink = [...byCategory(tiles, "food"), ...byCategory(tiles, "drink")];
  const people = byCategory(tiles, "people");

  // --- Special tiles (by English base word) ---
  const wantTile = findByWord(tiles, "I want");
  const dontWantTile = findByWord(tiles, "Don't want");
  const helpTile = findByWord(tiles, "Help");
  const stopTile = findByWord(tiles, "Stop");
  const moreTile = findByWord(tiles, "More");
  const againTile = findByWord(tiles, "Again");

  // --------------------------------------------------
  // 1) Feelings-only → "I feel happy."
  // --------------------------------------------------
  if (feelings.length && !wantTile && !dontWantTile && !helpTile) {
    const feelingsText = joinTiles(feelings, locale);
    return `${phrases.iFeel} ${feelingsText}${phrases.period}`;
  }

  // --------------------------------------------------
  // 2) Explicit HELP
  // --------------------------------------------------
  if (helpTile) {
    const otherTiles = tiles.filter((t) => t !== helpTile);
    if (!otherTiles.length) {
      // Just "Help!"
      return `${phrases.help}!`;
    } else {
      const targetText = joinTiles(otherTiles, locale);
      return `${phrases.iNeedHelp} ${targetText}${phrases.period}`;
    }
  }

  // --------------------------------------------------
  // 3) STOP tile alone
  // --------------------------------------------------
  if (stopTile && tiles.length === 1) {
    return `${phrases.stop}${phrases.period}`;
  }

  // --------------------------------------------------
  // 4) "More" / "Again" emphasis
  // --------------------------------------------------
  const extraWords: string[] = [];
  if (moreTile) extraWords.push(phrases.more);
  if (againTile) extraWords.push(phrases.again);

  // --------------------------------------------------
  // 5) "I want" / "Don't want" / implicit want
  // --------------------------------------------------
  let base: string;
  let hasExplicitWant = !!wantTile || !!dontWantTile;

  if (dontWantTile) {
    base = phrases.iDontWant;
  } else if (wantTile) {
    base = phrases.iWant;
  } else {
    // No explicit "I want" tile:
    // If we selected something we can want (food/drink/actions/people),
    // we implicitly prepend "I want / Je veux / أريد / Vreau".
    if (foodAndDrink.length || actions.length || people.length) {
      base = phrases.iWant;
      hasExplicitWant = true;
    } else {
      // Fallback: just read tiles in order
      const fallback = joinTiles(tiles, locale);
      return `${fallback}${phrases.period}`;
    }
  }

  // --------------------------------------------------
  // 6) Build the rest of the phrase
  // --------------------------------------------------
  let restParts: string[] = [];

  // Actions with "to" / "să" / "أن" etc.
  if (actions.length) {
    const goAction = actions.find((a) => a.word === "Go");

    if (goAction && people.length) {
      // "I want to go to mom."
      const peopleText = joinTiles(people, locale);
      const segment = phrases.toGoTo
        ? `${phrases.toGoTo} ${peopleText}`
        : peopleText;

      restParts.push(segment.trim());
    } else {
      // General action: "I want to sit", "I want to go"
      const actionsText = joinTiles(actions, locale);

      if (phrases.to) {
        restParts.push(`${phrases.to} ${actionsText}`.trim());
      } else {
        // Languages where we do not inject "to"
        restParts.push(actionsText);
      }
    }
  }

  // Food / drink / people as objects we want
  if (foodAndDrink.length || (!actions.length && people.length)) {
    const objectTargets = [
      ...foodAndDrink,
      ...(!actions.length ? people : []),
    ];
    const objectsText = joinTiles(objectTargets, locale);

    if (actions.length) {
      // "I want to drink water"
      restParts.push(objectsText);
    } else {
      // Pure object: "I want water", "I don't want soup"
      restParts.push(objectsText);
    }
  }

  // If we have no restParts (very short request like just "I want"),
  // just spell out tiles in order.
  let sentence: string;
  if (!restParts.length) {
    const raw = joinTiles(
      tiles.filter((t) => t !== wantTile && t !== dontWantTile),
      locale
    );
    sentence = hasExplicitWant ? `${base} ${raw}`.trim() : raw.trim();
  } else {
    sentence = `${base} ${restParts.join(" ")}`.trim();
  }

  // Add "more" / "again" at the end if present
  if (extraWords.length) {
    sentence = `${sentence} ${extraWords.join(" ")}`.trim();
  }

  return `${sentence}${phrases.period}`;
}

/**
 * Public API
 *
 * NOTE: mode ("simple" | "full") is already part of the signature
 * so we can extend behavior later without changing components.
 */

export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  phrases: PhraseSet,
  mode: GrammarMode = "simple"
): string {
  const ctx: SentenceContext = {
    tiles,
    locale,
    phrases,
    mode,
  };

  // In the future we can route to per-language plugins here:
  // e.g. englishGrammar.build(ctx), frenchGrammar.build(ctx), etc.
  // For now all languages share the same base engine, driven by PhraseSet.
  return buildFromContext(ctx);
}

// Re-export types for UI components (SentenceBar, etc.)
export type { PhraseSet as SentencePhraseSet };
