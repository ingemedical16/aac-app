// apps/frontend/src/lib/sentenceBuilder.ts
import { TileData } from "@/components/Tile";

/* ------------------------- TYPES ------------------------- */

export type Locale = "en" | "fr" | "ar" | "ro";
export type GrammarMode = "simple" | "full" | "smart";

export interface PhraseSet {
  iWant: string;
  iDontWant: string;
  iNeedHelp: string;
  help: string;
  iFeel: string;
  stop: string;
  more: string;
  again: string;
  to: string;       // “to”, “să”, “أن”
  toGoTo: string;   // “to go to”, “aller à”, “să merg la”
  period: string;
  and: string;      // NEW: for lists (and, et, și, و)
}

/* ------------------------- HELPERS ------------------------- */

const tf = (tile: TileData, locale: Locale) =>
  tile.translations?.[locale] || tile.word;

const joinWords = (tiles: TileData[], locale: Locale, connector: string) =>
  tiles.map((t) => tf(t, locale)).join(` ${connector} `);

const cat = (tiles: TileData[], c: string) =>
  tiles.filter((t) => t.category === c);

const isWord = (tile: TileData, w: string) =>
  tile.word.toLowerCase() === w.toLowerCase();

const find = (tiles: TileData[], w: string) =>
  tiles.find((t) => isWord(t, w));

/* ------------------------- PHRASES ------------------------- */

function getPhrases(locale: Locale): PhraseSet {
  switch (locale) {
    case "fr":
      return {
        iWant: "Je veux",
        iDontWant: "Je ne veux pas",
        iNeedHelp: "J’ai besoin d’aide",
        help: "Aide",
        iFeel: "Je me sens",
        stop: "Stop",
        more: "Encore",
        again: "Encore",
        to: "",
        toGoTo: "aller à",
        period: ".",
        and: "et"
      };

    case "ar":
      return {
        iWant: "أريد",
        iDontWant: "لا أريد",
        iNeedHelp: "أحتاج مساعدة",
        help: "مساعدة",
        iFeel: "أشعر",
        stop: "توقف",
        more: "المزيد",
        again: "مرة أخرى",
        to: "أن",
        toGoTo: "أن أذهب إلى",
        period: "。",
        and: "و"
      };

    case "ro":
      return {
        iWant: "Vreau",
        iDontWant: "Nu vreau",
        iNeedHelp: "Am nevoie de ajutor",
        help: "Ajutor",
        iFeel: "Mă simt",
        stop: "Stop",
        more: "Încă",
        again: "Încă o dată",
        to: "să",
        toGoTo: "să merg la",
        period: ".",
        and: "și"
      };

    default:
      return {
        iWant: "I want",
        iDontWant: "I don’t want",
        iNeedHelp: "I need help",
        help: "Help",
        iFeel: "I feel",
        stop: "Stop",
        more: "More",
        again: "Again",
        to: "to",
        toGoTo: "to go to",
        period: ".",
        and: "and"
      };
  }
}

/* ------------------------- MORPHOLOGY (full mode) ------------------------- */

function morphAction(locale: Locale, verb: string): string {
  const EN: Record<string, string> = {
    Go: "go",
    Sit: "sit",
    Stand: "stand",
    Eat: "eat",
    Drink: "drink",
  };

  const FR: Record<string, string> = {
    Go: "aller",
    Sit: "s’asseoir",
    Stand: "se lever",
    Eat: "manger",
    Drink: "boire",
  };

  const RO: Record<string, string> = {
    Go: "să merg",
    Sit: "să stau jos",
    Stand: "să mă ridic",
    Eat: "să mănânc",
    Drink: "să beau",
  };

  const AR: Record<string, string> = {
    Go: "أن أذهب",
    Sit: "أن أجلس",
    Stand: "أن أقف",
    Eat: "أن آكل",
    Drink: "أن أشرب",
  };

  const tables = { en: EN, fr: FR, ro: RO, ar: AR };
  const table = tables[locale] || EN;

  return table[verb] || verb.toLowerCase();
}

/* ------------------------- SMART MODE LOGIC ------------------------- */
/**
 * person + object → "Mom, I want bread."
 */
function smartModePersonObject(locale: Locale, phrases: PhraseSet, people: TileData[], objects: TileData[]) {
  const person = tf(people[0], locale);
  const objectText = joinWords(objects, locale, phrases.and);
  return `${person}, ${phrases.iWant} ${objectText}${phrases.period}`;
}

/* ------------------------- MAIN ENGINE ------------------------- */

export function buildSentence(
  tiles: TileData[],
  locale: Locale,
  mode: GrammarMode = "simple"
): string {
  if (!tiles.length) return "";

  const phrases = getPhrases(locale);

  const feelings = cat(tiles, "feelings");
  const actions = cat(tiles, "actions");
  const foods = cat(tiles, "food");
  const drinks = cat(tiles, "drink");
  const foodDrinks = [...foods, ...drinks];
  const people = cat(tiles, "people");

  const want = find(tiles, "I want");
  const dontWant = find(tiles, "Don't want");
  const helpTile = find(tiles, "Help");
  const stopTile = find(tiles, "Stop");
  const moreTile = find(tiles, "More");
  const againTile = find(tiles, "Again");

  /* FEELINGS ONLY */
  if (feelings.length && !want && !dontWant && !helpTile) {
    return `${phrases.iFeel} ${joinWords(feelings, locale, phrases.and)}${phrases.period}`;
  }

  /* HELP */
  if (helpTile) {
    const others = tiles.filter(t => t !== helpTile);
    if (!others.length) return `${phrases.help}!`;
    return `${phrases.iNeedHelp} ${joinWords(others, locale, phrases.and)}${phrases.period}`;
  }

  /* STOP */
  if (stopTile && tiles.length === 1) {
    return `${phrases.stop}${phrases.period}`;
  }

  /* SMART MODE */
  if (mode === "smart" && people.length && foodDrinks.length) {
    return smartModePersonObject(locale, phrases, people, foodDrinks);
  }

  /* BASE: WANT / DON'T WANT / IMPLIED WANT */
  const base = dontWant ? phrases.iDontWant : phrases.iWant;

  /* FULL MODE → morphology */
  let actionPart = "";
  if (actions.length) {
    actionPart = mode === "full"
      ? morphAction(locale, actions[0].word)
      : tf(actions[0], locale);
  }

  /* OBJECT LIST */
  const objectsPart = foodDrinks.length
    ? joinWords(foodDrinks, locale, phrases.and)
    : "";

  let result = base;

  if (actionPart) result += ` ${phrases.to} ${actionPart}`;
  if (objectsPart) result += ` ${objectsPart}`;

  /* MORE / AGAIN */
  const extras: string[] = [];
  if (moreTile) extras.push(phrases.more);
  if (againTile) extras.push(phrases.again);
  if (extras.length) result += ` ${extras.join(" ")}`;

  return result.trim() + phrases.period;
}
