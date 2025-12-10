import { TileData } from "@/components/Tile";

/**
 * Grammar Engine v3 (hybrid-ready)
 *
 * - Works offline with rules.
 * - Designed so later we can add real AI smoothing on backend.
 *
 * Examples:
 * - [I want] + [Water]               → "I want water."
 * - [I want] + [Drink] + [Water]     → "I want to drink water."
 * - [I want] + [Go] + [Mom]          → "I want to go to mom."
 * - [Happy]                          → "I feel happy."
 * - [Help] + [Sit]                   → "I need help to sit."
 * - [More] + [Water]                 → "I want more water."
 */

export type Locale = "en" | "fr" | "ar" | "ro" | (string & {});
export type TranslatorFn = (key: string) => string;

interface PhraseSet {
  iWant: string;
  iDontWant: string;
  iNeedHelp: string;
  help: string;
  iFeel: string;
  stop: string;
  more: string;
  again: string;
  to: string;       // "to", "să", "أن", ""
  toGoTo: string;   // "to go to", "să merg la", "أن أذهب إلى", ...
  period: string;
}

function fromT(
  t: TranslatorFn | undefined,
  key: string,
  fallback: string
): string {
  if (!t) return fallback;
  try {
    const value = t(key);
    // if i18next returns the key itself or empty, fallback
    if (!value || value === key) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

function getPhrases(locale: Locale, t?: TranslatorFn): PhraseSet {
  switch (locale) {
    case "fr":
      return {
        iWant: fromT(t, "grammar.iWant", "Je veux"),
        iDontWant: fromT(t, "grammar.iDontWant", "Je ne veux pas"),
        iNeedHelp: fromT(t, "grammar.iNeedHelp", "J'ai besoin d'aide"),
        help: fromT(t, "grammar.help", "Aide"),
        iFeel: fromT(t, "grammar.iFeel", "Je me sens"),
        stop: fromT(t, "grammar.stop", "Stop"),
        more: fromT(t, "grammar.more", "Encore"),
        again: fromT(t, "grammar.again", "Encore"),
        to: fromT(t, "grammar.to", ""),
        toGoTo: fromT(t, "grammar.toGoTo", "aller à"),
        period: fromT(t, "grammar.period", "."),
      };
    case "ar":
      return {
        iWant: fromT(t, "grammar.iWant", "أريد"),
        iDontWant: fromT(t, "grammar.iDontWant", "لا أريد"),
        iNeedHelp: fromT(t, "grammar.iNeedHelp", "أحتاج مساعدة"),
        help: fromT(t, "grammar.help", "مساعدة"),
        iFeel: fromT(t, "grammar.iFeel", "أشعر أنني"),
        stop: fromT(t, "grammar.stop", "توقف"),
        more: fromT(t, "grammar.more", "المزيد"),
        again: fromT(t, "grammar.again", "مرة أخرى"),
        to: fromT(t, "grammar.to", "أن"),
        toGoTo: fromT(t, "grammar.toGoTo", "أن أذهب إلى"),
        period: fromT(t, "grammar.period", "."),
      };
    case "ro":
      return {
        iWant: fromT(t, "grammar.iWant", "Vreau"),
        iDontWant: fromT(t, "grammar.iDontWant", "Nu vreau"),
        iNeedHelp: fromT(t, "grammar.iNeedHelp", "Am nevoie de ajutor"),
        help: fromT(t, "grammar.help", "Ajutor"),
        iFeel: fromT(t, "grammar.iFeel", "Mă simt"),
        stop: fromT(t, "grammar.stop", "Stop"),
        more: fromT(t, "grammar.more", "Încă"),
        again: fromT(t, "grammar.again", "Încă o dată"),
        to: fromT(t, "grammar.to", "să"),
        toGoTo: fromT(t, "grammar.toGoTo", "să merg la"),
        period: fromT(t, "grammar.period", "."),
      };
    case "en":
    default:
      return {
        iWant: fromT(t, "grammar.iWant", "I want"),
        iDontWant: fromT(t, "grammar.iDontWant", "I don't want"),
        iNeedHelp: fromT(t, "grammar.iNeedHelp", "I need help"),
        help: fromT(t, "grammar.help", "Help"),
        iFeel: fromT(t, "grammar.iFeel", "I feel"),
        stop: fromT(t, "grammar.stop", "Stop"),
        more: fromT(t, "grammar.more", "More"),
        again: fromT(t, "grammar.again", "Again"),
        to: fromT(t, "grammar.to", "to"),
        toGoTo: fromT(t, "grammar.toGoTo", "to go to"),
        period: fromT(t, "grammar.period", "."),
      };
  }
}

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
  const lower = word.toLowerCase();
  return tiles.find((t) => t.word.toLowerCase() === lower);
}

/**
 * Main API used by SentenceBar
 */
export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  t?: TranslatorFn
): string {
  if (!tiles.length) return "";

  const phrases = getPhrases(locale, t);

  const feelings = byCategory(tiles, "feelings");
  const actions = byCategory(tiles, "actions");
  const foodAndDrink = [
    ...byCategory(tiles, "food"),
    ...byCategory(tiles, "drink"),
  ];
  const people = byCategory(tiles, "people");

  const wantTile = findByWord(tiles, "I want");
  const dontWantTile = findByWord(tiles, "Don't want");
  const helpTile = findByWord(tiles, "Help");
  const stopTile = findByWord(tiles, "Stop");
  const moreTile = findByWord(tiles, "More");
  const againTile = findByWord(tiles, "Again");

  // -----------------------------
  // 1) Feelings-only or dominant
  // -----------------------------
  if (
    feelings.length &&
    !helpTile &&
    !stopTile &&
    !moreTile &&
    !againTile &&
    !foodAndDrink.length &&
    !actions.length
  ) {
    // Examples:
    // [Happy] → "I feel happy."
    const feelingsText = joinTiles(feelings, locale);
    return `${phrases.iFeel} ${feelingsText}${phrases.period}`;
  }

  // If user did [I want] + [Sad] only → treat as feelings
  if (
    feelings.length &&
    (wantTile || dontWantTile) &&
    tiles.length === feelings.length + 1
  ) {
    const feelingsText = joinTiles(feelings, locale);
    return `${phrases.iFeel} ${feelingsText}${phrases.period}`;
  }

  // ---------
  // 2) HELP
  // ---------
  if (helpTile) {
    const other = tiles.filter((t) => t !== helpTile);
    if (!other.length) {
      // Just [Help] → "Help!"
      return `${phrases.help}!`;
    }

    const helpActions = byCategory(other, "actions");
    const others = other.filter((t) => t.category !== "actions");

    if (helpActions.length) {
      // "I need help to sit." / "Am nevoie de ajutor să stau jos."
      const actionsText = joinTiles(helpActions, locale);
      if (phrases.to) {
        const base = `${phrases.iNeedHelp} ${phrases.to} ${actionsText}`;
        const extra =
          others.length > 0 ? ` ${joinTiles(others, locale)}` : "";
        return `${base}${extra}${phrases.period}`;
      } else {
        const base = `${phrases.iNeedHelp} ${actionsText}`;
        const extra =
          others.length > 0 ? ` ${joinTiles(others, locale)}` : "";
        return `${base}${extra}${phrases.period}`;
      }
    }

    // Help + (object/feeling/etc.)
    const targetText = joinTiles(other, locale);
    return `${phrases.iNeedHelp} ${targetText}${phrases.period}`;
  }

  // ---------------
  // 3) STOP only
  // ---------------
  if (stopTile && tiles.length === 1) {
    return `${phrases.stop}${phrases.period}`;
  }

  // ------------------------------
  // 4) MORE / AGAIN as modifiers
  // ------------------------------
  const extraWords: string[] = [];
  if (moreTile) extraWords.push(phrases.more);
  if (againTile) extraWords.push(phrases.again);

  // Remove them from core logic list (they'll be appended later)
  const coreTiles = tiles.filter(
    (t) => t !== moreTile && t !== againTile
  );

  // ----------------------------------------
  // 5) Implicit / explicit "I want" logic
  // ----------------------------------------
  let base: string;
  let hasExplicitWant = !!wantTile || !!dontWantTile;

  if (dontWantTile) {
    base = phrases.iDontWant;
  } else if (wantTile) {
    base = phrases.iWant;
  } else {
    // No explicit want/don't want:
    // If tiles contain something we can "want" → implicitly add "I want"
    if (
      byCategory(coreTiles, "food").length ||
      byCategory(coreTiles, "drink").length ||
      byCategory(coreTiles, "actions").length ||
      byCategory(coreTiles, "people").length
    ) {
      base = phrases.iWant;
      hasExplicitWant = true;
    } else {
      // Nothing "wantable" → just read tiles in order
      const fallback = joinTiles(coreTiles, locale);
      const sentenceWithExtras = extraWords.length
        ? `${fallback} ${extraWords.join(" ")}`
        : fallback;
      return `${sentenceWithExtras}${phrases.period}`;
    }
  }

  // Remove explicit want/don't from the list for rest building
  const withoutWant = coreTiles.filter(
    (t) => t !== wantTile && t !== dontWantTile
  );

  const restActions = byCategory(withoutWant, "actions");
  const restFoodDrink = [
    ...byCategory(withoutWant, "food"),
    ...byCategory(withoutWant, "drink"),
  ];
  const restPeople = byCategory(withoutWant, "people");
  const restFeelings = byCategory(withoutWant, "feelings").filter(
    (t) => !feelings.includes(t)
  );
  const restOther = withoutWant.filter(
    (t) =>
      t.category !== "actions" &&
      t.category !== "food" &&
      t.category !== "drink" &&
      t.category !== "people" &&
      t.category !== "feelings"
  );

  const restParts: string[] = [];

  // Actions: "I want to sit", "I want to go to mom"
  if (restActions.length) {
    const goAction = restActions.find((a) =>
      a.word.toLowerCase().includes("go")
    );

    if (goAction && restPeople.length) {
      const peopleText = joinTiles(restPeople, locale);
      // "I want to go to mom."
      if (phrases.toGoTo) {
        restParts.push(`${phrases.toGoTo} ${peopleText}`);
      } else {
        restParts.push(peopleText);
      }
    } else {
      const actionsText = joinTiles(restActions, locale);
      if (phrases.to) {
        restParts.push(`${phrases.to} ${actionsText}`);
      } else {
        restParts.push(actionsText);
      }
    }
  }

  // Objects of wanting: food/drink/people if not already used with a verb
  if (restFoodDrink.length || (!restActions.length && restPeople.length)) {
    const objectsText = joinTiles(
      [
        ...restFoodDrink,
        ...(!restActions.length ? restPeople : []),
      ],
      locale
    );

    restParts.push(objectsText);
  }

  // Feelings when combined with want: "I want to feel happy" is too complex.
  // For now, just append as simple object: "I want happy"
  if (restFeelings.length && !restActions.length && !restFoodDrink.length) {
    const feelingsText = joinTiles(restFeelings, locale);
    restParts.push(feelingsText);
  }

  if (restOther.length) {
    restParts.push(joinTiles(restOther, locale));
  }

  // If we have no restParts (user only pressed "I want")
  let sentence: string;
  if (!restParts.length) {
    const raw = joinTiles(withoutWant, locale);
    sentence = hasExplicitWant ? `${base} ${raw}`.trim() : raw;
  } else {
    sentence = `${base} ${restParts.join(" ")}`.trim();
  }

  if (extraWords.length) {
    sentence = `${sentence} ${extraWords.join(" ")}`.trim();
  }

  return `${sentence}${phrases.period}`;
}
