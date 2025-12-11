// apps/frontend/src/lib/sentenceBuilder.ts

import { TileData } from "@/components/Tile";

/**
 * Grammar Engine v3 (Enterprise)
 *
 * - No React hooks here (pure TypeScript utilities).
 * - Multilingual plugin-ready architecture.
 * - Works with externalized UI phrases (i18n).
 *
 * The engine is:
 *   - Locale-aware (en, fr, ar, ro, + fallback)
 *   - Category-aware (help, feelings, actions, food, drink, people, etc.)
 *   - Extensible via GrammarPlugin (for morphology / special cases later)
 */

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type CoreLocale = "en" | "fr" | "ar" | "ro";
export type Locale = CoreLocale | (string & {});

/**
 * Phrases are provided by the UI layer (i18n),
 * so the engine does NOT depend on React or i18next.
 *
 * These keys should match what you expose in common.json:
 *   "iWant", "iDontWant", "iNeedHelp", "help", "iFeel",
 *   "stop", "more", "again", "to", "toGoTo", "period"
 */
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

export interface GrammarContext {
  locale: Locale;
  tiles: TileData[];
  phrases: PhraseSet;
}

export interface GrammarPlugin {
  /**
   * Simple identifier, useful for debugging / metrics.
   */
  id: string;

  /**
   * Decide whether this plugin applies to a given locale.
   * Example: locale startsWith("en") or equals "fr".
   */
  matches(locale: Locale): boolean;

  /**
   * Optional hook to transform an action verb depending on context
   * (future feature: morphology, e.g., "go" → "going").
   */
  morphAction?(verb: string, ctx: GrammarContext): string;

  /**
   * Optional full override: if plugin returns a non-null string,
   * the base engine is skipped, allowing fully custom grammar.
   *
   * For most cases, you will return null and let the base engine run.
   */
  buildCustomSentence?(ctx: GrammarContext): string | null;
}

// --------------------------------------------------
// PLUGIN REGISTRY (for future advanced behaviour)
// --------------------------------------------------

const englishPlugin: GrammarPlugin = {
  id: "en-basic",
  matches(locale) {
    return locale.toLowerCase().startsWith("en");
  },
  morphAction(verb, ctx) {
    // Placeholder for future morphology, currently no change.
    // Example for future: if ctx.mode === "progressive" ⇒ verb + "ing"
    return verb;
  },
  buildCustomSentence() {
    // For now, we let the base engine handle English.
    return null;
  },
};

const frenchPlugin: GrammarPlugin = {
  id: "fr-basic",
  matches(locale) {
    return locale.toLowerCase().startsWith("fr");
  },
  morphAction(verb) {
    // For French demo, keep verbs as they are (infinitive / command).
    return verb;
  },
  buildCustomSentence() {
    return null;
  },
};

const arabicPlugin: GrammarPlugin = {
  id: "ar-basic",
  matches(locale) {
    return locale.toLowerCase().startsWith("ar");
  },
  morphAction(verb) {
    return verb;
  },
  buildCustomSentence() {
    return null;
  },
};

const romanianPlugin: GrammarPlugin = {
  id: "ro-basic",
  matches(locale) {
    return locale.toLowerCase().startsWith("ro");
  },
  morphAction(verb) {
    return verb;
  },
  buildCustomSentence() {
    return null;
  },
};

const fallbackPlugin: GrammarPlugin = {
  id: "fallback",
  matches() {
    return true;
  },
  morphAction(verb) {
    return verb;
  },
  buildCustomSentence() {
    return null;
  },
};

const PLUGINS: GrammarPlugin[] = [
  englishPlugin,
  frenchPlugin,
  arabicPlugin,
  romanianPlugin,
  fallbackPlugin,
];

function resolvePlugin(locale: Locale): GrammarPlugin {
  return (
    PLUGINS.find((p) => {
      try {
        return p.matches(locale);
      } catch {
        return false;
      }
    }) ?? fallbackPlugin
  );
}

// --------------------------------------------------
// INTERNAL HELPERS
// --------------------------------------------------

function normalizeLocale(locale: Locale): string {
  return locale.toLowerCase().slice(0, 2);
}

function textForTile(tile: TileData, locale: Locale): string {
  const lc = normalizeLocale(locale);
  // Try exact (en, fr, ar, ro) first, then fallback to raw word
  return (
    tile.translations?.[lc] ||
    tile.translations?.[locale] ||
    tile.word
  );
}

function joinTiles(tiles: TileData[], locale: Locale): string {
  return tiles.map((t) => textForTile(t, locale)).join(" ");
}

function byCategory(tiles: TileData[], category: string): TileData[] {
  return tiles.filter((t) => t.category === category);
}

function findWord(tiles: TileData[], word: string): TileData | undefined {
  const lower = word.toLowerCase();
  return tiles.find((t) => t.word.toLowerCase() === lower);
}

// --------------------------------------------------
// BASE ENGINE (LANGUAGE-NEUTRAL STRATEGY + LOCALE CONFIG)
// --------------------------------------------------

function baseBuildSentence(ctx: GrammarContext, plugin: GrammarPlugin): string {
  const { tiles, locale, phrases } = ctx;

  if (!tiles.length) return "";

  const lc = normalizeLocale(locale);

  const feelings = byCategory(tiles, "feelings");
  const actions = byCategory(tiles, "actions");
  const foodAndDrink = [...byCategory(tiles, "food"), ...byCategory(tiles, "drink")];
  const people = byCategory(tiles, "people");

  const wantTile = findWord(tiles, "I want");
  const dontWantTile = findWord(tiles, "Don't want");
  const helpTile = findWord(tiles, "Help");
  const stopTile = findWord(tiles, "Stop");
  const moreTile = findWord(tiles, "More");
  const againTile = findWord(tiles, "Again");

  const extraWords: string[] = [];
  if (moreTile) extraWords.push(phrases.more);
  if (againTile) extraWords.push(phrases.again);

  // ------------------------------------------
  // 1) Feelings dominant → "I feel happy."
  // ------------------------------------------

  if (feelings.length && !wantTile && !dontWantTile && !helpTile) {
    const feelingsText = joinTiles(feelings, locale);
    return `${phrases.iFeel} ${feelingsText}${phrases.period}`;
  }

  // ------------------------------------------
  // 2) HELP cases
  // ------------------------------------------

  if (helpTile) {
    const otherTiles = tiles.filter((t) => t !== helpTile);
    if (!otherTiles.length) {
      // Single "Help" tile
      return `${phrases.help}!`;
    } else {
      const targetText = joinTiles(otherTiles, locale);
      return `${phrases.iNeedHelp} ${targetText}${phrases.period}`;
    }
  }

  // ------------------------------------------
  // 3) STOP alone
  // ------------------------------------------

  if (stopTile && tiles.length === 1) {
    return `${phrases.stop}${phrases.period}`;
  }

  // ------------------------------------------
  // 4) WANT / DON'T WANT logic
  // ------------------------------------------

  let base: string;
  let hasExplicitWant = !!wantTile || !!dontWantTile;

  if (dontWantTile) {
    base = phrases.iDontWant;
  } else if (wantTile) {
    base = phrases.iWant;
  } else {
    // Implicit desire: if user selects something "wantable"
    if (foodAndDrink.length || actions.length || people.length) {
      base = phrases.iWant;
      hasExplicitWant = true;
    } else {
      // Nothing to "want", just read tiles
      const fallback = joinTiles(tiles, locale);
      return `${fallback}${phrases.period}`;
    }
  }

  // ------------------------------------------
  // 5) Build rest of phrase
  // ------------------------------------------

  const restParts: string[] = [];

  // Actions
  if (actions.length) {
    const goAction = actions.find((a) => a.word.toLowerCase() === "go");

    const actionsTextRaw = joinTiles(actions, locale);
    const actionsText =
      plugin.morphAction?.(actionsTextRaw, ctx) ?? actionsTextRaw;

    if (goAction && people.length) {
      // Example: "I want to go to mom"
      const peopleText = joinTiles(people, locale);
      if (phrases.toGoTo) {
        restParts.push(`${phrases.toGoTo} ${peopleText}`);
      } else {
        restParts.push(peopleText);
      }
    } else {
      // Generic action: "I want to sit", "Je veux assis"
      if (phrases.to) {
        restParts.push(`${phrases.to} ${actionsText}`);
      } else {
        restParts.push(actionsText);
      }
    }
  }

  // Objects (food, drink, people if not already used with "to go to")
  if (foodAndDrink.length || (!actions.length && people.length)) {
    const objects = [...foodAndDrink, ...(!actions.length ? people : [])];
    const objectsText = joinTiles(objects, locale);

    if (actions.length) {
      // "I want to drink water"
      restParts.push(objectsText);
    } else {
      // "I want water"
      restParts.push(objectsText);
    }
  }

  // If nothing in restParts, we may just have "I want" and maybe feelings, etc.
  let sentence: string;
  if (!restParts.length) {
    const raw = joinTiles(
      tiles.filter((t) => t !== wantTile && t !== dontWantTile),
      locale
    );
    sentence = hasExplicitWant ? `${base} ${raw}`.trim() : raw;
  } else {
    sentence = `${base} ${restParts.join(" ")}`.trim();
  }

  // Extra emphasis words at the end ("More", "Again")
  if (extraWords.length) {
    sentence = `${sentence} ${extraWords.join(" ")}`.trim();
  }

  return `${sentence}${phrases.period}`;
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------

/**
 * Main entry point.
 *
 * The UI (SentenceBar) is responsible for:
 *   - providing the locale (e.g., "en", "fr", "ar", "ro"),
 *   - providing a PhraseSet taken from i18next translations.
 */
export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  phrases: PhraseSet
): string {
  if (!tiles.length) return "";

  const ctx: GrammarContext = {
    tiles,
    locale,
    phrases,
  };

  const plugin = resolvePlugin(locale);

  // If plugin wants to fully control sentence creation, it can.
  const custom = plugin.buildCustomSentence?.(ctx);
  if (typeof custom === "string" && custom.trim().length > 0) {
    return custom;
  }

  // Otherwise, use shared base engine with plugin hooks (for morphology).
  return baseBuildSentence(ctx, plugin);
}
