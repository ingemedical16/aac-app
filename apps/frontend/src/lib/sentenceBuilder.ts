import { TileData } from "@/components/Tile";
import i18next from "i18next";

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

/** Load grammar phrases from i18next */
function getPhrases(locale: Locale): PhraseSet {
  const t = (key: string) => i18next.getFixedT(locale)("common:" + key);

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

function textForTile(tile: TileData, locale: Locale): string {
  return tile.translations?.[locale] || tile.word;
}

function joinTiles(tiles: TileData[], locale: Locale): string {
  return tiles.map((t) => textForTile(t, locale)).join(" ");
}

export function buildSentence(tiles: TileData[], locale: Locale): string {
  if (!tiles.length) return "";

  const phrases = getPhrases(locale);

  const byCat = (cat: string) => tiles.filter((t) => t.category === cat);

  const feelings = byCat("feelings");
  const actions = byCat("actions");
  const objects = [...byCat("food"), ...byCat("drink")];
  const people = byCat("people");

  const findWord = (w: string) =>
    tiles.find((t) => t.word.toLowerCase() === w.toLowerCase());

  const want = findWord("I want");
  const dontWant = findWord("Don't want");
  const helpTile = findWord("Help");
  const stopTile = findWord("Stop");
  const moreTile = findWord("More");
  const againTile = findWord("Again");

  // FEELINGS → "I feel sad."
  if (feelings.length && !want && !dontWant && !helpTile) {
    return `${phrases.iFeel} ${joinTiles(feelings, locale)}${phrases.period}`;
  }

  // HELP → "I need help sit."
  if (helpTile) {
    const rest = tiles.filter((t) => t !== helpTile);
    if (!rest.length) return `${phrases.help}!`;
    return `${phrases.iNeedHelp} ${joinTiles(rest, locale)}${phrases.period}`;
  }

  // STOP → "Stop."
  if (stopTile && tiles.length === 1) return `${phrases.stop}${phrases.period}`;

  // EXTRA WORDS
  const extra: string[] = [];
  if (moreTile) extra.push(phrases.more);
  if (againTile) extra.push(phrases.again);

  // WANT / DON'T WANT
  let base = want
    ? phrases.iWant
    : dontWant
    ? phrases.iDontWant
    : objects.length || actions.length || people.length
    ? phrases.iWant
    : "";

  // BUILD MAIN ACTION/OBJECT
  let parts: string[] = [];

  if (actions.length) {
    const go = actions.find((a) => a.word === "Go");

    if (go && people.length) {
      // I want to go to mom
      parts.push(`${phrases.toGoTo} ${joinTiles(people, locale)}`);
    } else {
      const actionsText = joinTiles(actions, locale);
      parts.push(phrases.to ? `${phrases.to} ${actionsText}` : actionsText);
    }
  }

  if (objects.length || (!actions.length && people.length)) {
    parts.push(
      joinTiles([...objects, ...(!actions.length ? people : [])], locale)
    );
  }

  let sentence = base;

  if (parts.length) sentence += " " + parts.join(" ");
  else if (base) sentence += " " + joinTiles(tiles, locale);

  if (extra.length) sentence += " " + extra.join(" ");

  return `${sentence.trim()}${phrases.period}`;
}
