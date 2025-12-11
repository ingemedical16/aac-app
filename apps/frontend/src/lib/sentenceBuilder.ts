// apps/frontend/src/lib/sentenceBuilder.ts

import { TileData } from "@/components/Tile";

/** TYPES **/
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
  to: string;      // e.g. "to", "să", "أن", "" (FR)
  toGoTo: string;  // e.g. "to go to", "aller à", "أن أذهب إلى", "să merg la"
  period: string;
}

interface SentenceContext {
  tiles: TileData[];
  locale: Locale;
  phrases: PhraseSet;
  mode: GrammarMode;
}

/** HELPERS **/
function tf(tile: TileData, locale: Locale): string {
  return tile.translations?.[locale] || tile.word;
}

function join(tiles: TileData[], locale: Locale): string {
  return tiles.map((t) => tf(t, locale)).join(" ");
}

function cat(tiles: TileData[], c: string) {
  return tiles.filter((t) => t.category === c);
}

function isWord(tile: TileData, w: string) {
  return tile.word.toLowerCase() === w.toLowerCase();
}

function find(tiles: TileData[], w: string) {
  return tiles.find((t) => isWord(t, w));
}

/** --------------------------
 *  1) FULL MODE MORPHOLOGY
 * ------------------------- **/

function applyEnglishMorphology(action: string, object: string | null): string {
  // We keep it very simple and safe.
  const infinitives: Record<string, string> = {
    Go: "go",
    Sit: "sit",
    Stand: "stand",
    Eat: "eat",
    Drink: "drink",
  };

  const base = infinitives[action] || action.toLowerCase();

  // For now we do not change form based on object, just return the verb.
  if (!object) return base;
  return base;
}

function applyFrenchMorphology(action: string): string {
  // Use infinitive forms where helpful.
  const infinitives: Record<string, string> = {
    Go: "aller",
    Sit: "s’asseoir",
    Stand: "se lever",
    Eat: "manger",
    Drink: "boire",
  };
  return infinitives[action] || action.toLowerCase();
}

function applyRomanianMorphology(action: string): string {
  // Forms already contain "să", so we must avoid adding it again later.
  const forms: Record<string, string> = {
    Go: "să merg",
    Sit: "să stau jos",
    Stand: "să mă ridic",
    Eat: "să mănânc",
    Drink: "să beau",
  };
  return forms[action] || action.toLowerCase();
}

function applyArabicMorphology(action: string): string {
  // Forms already contain "أن", so we must avoid adding it again later.
  const forms: Record<string, string> = {
    Go: "أن أذهب",
    Sit: "أن أجلس",
    Stand: "أن أقف",
    Eat: "أن آكل",
    Drink: "أن أشرب",
  };
  return forms[action] || action;
}

function applyMorphology(
  locale: Locale,
  actions: TileData[],
  objects: TileData[]
): string {
  if (!actions.length) return "";

  const first = actions[0].word;
  const objectText = objects.length ? objects[0].word : null;

  switch (locale) {
    case "en":
      return applyEnglishMorphology(first, objectText);
    case "fr":
      return applyFrenchMorphology(first);
    case "ro":
      return applyRomanianMorphology(first);
    case "ar":
      return applyArabicMorphology(first);
    default:
      // Fallback: lowercased English label
      return first.toLowerCase();
  }
}

/** ------------------------------
 *  2) DESTINATION PREPOSITIONS
 * ------------------------------ **/

/**
 * Normalize destination like "Mom", "Dad", "Teacher", "Friend"
 * using the *translated* word in each language and proper preposition.
 */
function normalizeDestination(locale: Locale, personTile: TileData): string {
  const label = tf(personTile, locale); // localized label

  switch (locale) {
    case "en":
      // "my mom", "my dad", "my teacher", "my friend"
      return `my ${label.toLowerCase()}`;
    case "fr": {
      // Keep it simple: "chez maman", "chez papa", "chez le professeur", "chez mon ami"
      const lower = label.toLowerCase();
      if (lower.includes("maman")) return "chez maman";
      if (lower.includes("papa")) return "chez papa";
      if (lower.includes("prof")) return "chez le professeur";
      if (lower.includes("ami")) return "chez mon ami";
      return `chez ${lower}`;
    }
    case "ro": {
      // "la mama", "la tata", "la profesor", "la prieten"
      const lower = label.toLowerCase();
      if (lower.includes("mama")) return "la mama";
      if (lower.includes("tata")) return "la tata";
      if (lower.includes("profesor")) return "la profesor";
      if (lower.includes("prieten")) return "la prieten";
      return `la ${lower}`;
    }
    case "ar": {
      // Arabic labels already in Arabic; prefix with "إلى"
      // e.g. "إلى أمي", "إلى أبي", "إلى المعلمة", "إلى صديقي"
      return `إلى ${label}`;
    }
    default:
      return label;
  }
}

/** -------------------------------------
 *  MAIN GRAMMAR ENGINE
 * ------------------------------------ **/

function buildFromContext(ctx: SentenceContext): string {
  const { tiles, locale, phrases, mode } = ctx;
  if (!tiles.length) return "";

  const feelings = cat(tiles, "feelings");
  const actions = cat(tiles, "actions");
  const foodDrinks = [...cat(tiles, "food"), ...cat(tiles, "drink")];
  const people = cat(tiles, "people");

  const wantTile = find(tiles, "I want");
  const dontWantTile = find(tiles, "Don't want");
  const helpTile = find(tiles, "Help");
  const stopTile = find(tiles, "Stop");
  const moreTile = find(tiles, "More");
  const againTile = find(tiles, "Again");

  /** FEELINGS → “I feel happy.” */
  if (feelings.length && !wantTile && !dontWantTile && !helpTile) {
    return `${phrases.iFeel} ${join(feelings, locale)}${phrases.period}`;
  }

  /** HELP */
  if (helpTile) {
    const others = tiles.filter((t) => t !== helpTile);
    if (!others.length) return `${phrases.help}!`;

    return `${phrases.iNeedHelp} ${join(others, locale)}${phrases.period}`;
  }

  /** STOP */
  if (stopTile && tiles.length === 1) {
    return `${phrases.stop}${phrases.period}`;
  }

  /** MORE/AGAIN emphasis */
  const extra: string[] = [];
  if (moreTile) extra.push(phrases.more);
  if (againTile) extra.push(phrases.again);

  /** WANT / DON'T WANT / implicit want */
  let base: string;
  // explicit is kept for future use if needed
  const explicit = !!wantTile || !!dontWantTile;

  if (dontWantTile) base = phrases.iDontWant;
  else if (wantTile) base = phrases.iWant;
  else base = phrases.iWant;

  /** FULL MODE: special handling for GO + PEOPLE (destination) */
  let actionPart = "";
  if (actions.length) {
    if (mode === "full") {
      const morph = applyMorphology(locale, actions, foodDrinks);
      actionPart = morph;

      // GO + PERSON → "I want to go to my mom", "Je veux aller chez maman", ...
      if (people.length) {
        const personTile = people[0];
        const dest = normalizeDestination(locale, personTile);
        // Use toGoTo phrase (already localized)
        return `${base} ${phrases.toGoTo} ${dest}${phrases.period}`;
      }
    } else {
      /** SIMPLE MODE: just use tile labels in that language */
      actionPart = join(actions, locale);
    }
  }

  /** OBJECTS (food, drink, people in some cases) */
  let objectPart = "";
  if (foodDrinks.length) {
    objectPart = join(foodDrinks, locale);
  } else if (!actions.length && people.length) {
    // No verb, only person → "I want mom / Je veux maman / أريد أمي / Vreau mama"
    const personTile = people[0];
    if (mode === "full") {
      objectPart = normalizeDestination(locale, personTile);
    } else {
      objectPart = tf(personTile, locale);
    }
  }

  /** Build final sentence with morphology-aware "to" behaviour */
  let result = `${base}`;

  if (actionPart) {
    // Avoid duplicating "to / să / أن" for RO + AR when the form already includes it.
    const toToken = phrases.to?.trim();
    const hasLeadingTo =
      toToken &&
      actionPart.startsWith(toToken) &&
      (actionPart === toToken || actionPart.startsWith(toToken + " "));

    if (mode === "full" && toToken) {
      if (hasLeadingTo) {
        // Already contains "să" / "أن" etc: just append the verb phrase.
        result += ` ${actionPart}`;
      } else {
        // Needs explicit "to" / "să" / "أن"...
        result += ` ${toToken} ${actionPart}`;
      }
    } else if (mode === "simple" && toToken) {
      result += ` ${toToken} ${actionPart}`;
    } else {
      // No explicit connector word
      result += ` ${actionPart}`;
    }
  }

  if (objectPart) {
    result += ` ${objectPart}`;
  }

  if (extra.length) {
    result += ` ${extra.join(" ")}`;
  }

  return result.trim() + phrases.period;
}

/** PUBLIC API **/
export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  phrases: PhraseSet,
  mode: GrammarMode = "simple"
): string {
  const ctx: SentenceContext = { tiles, locale, phrases, mode };
  return buildFromContext(ctx);
}

export type { PhraseSet as SentencePhraseSet };
