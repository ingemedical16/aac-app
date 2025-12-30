import type { TileData } from "@/types/tile";

// ---------------------------------------------
// BASIC WORD CLASSIFICATION
// ---------------------------------------------
const feelings = ["sad", "angry", "tired", "happy"];
const wants = ["want", "eat", "drink"];
const subjects = ["i", "mom", "dad", "he", "she", "you", "we"];

// ---------------------------------------------
// SMART GRAMMAR ENGINE
// ---------------------------------------------
export function buildSmartSentence(tiles: TileData[], locale: string): string {
  if (!tiles.length) return "";

  const words = tiles.map(
    (tile) => tile.translations?.[locale] || tile.word.toLowerCase()
  );

  let sentence = "";

  // ---------------------------------------------
  // FEELINGS: "I feel sad"
  // ---------------------------------------------
  if (words.length === 1 && feelings.includes(words[0])) {
    switch (locale) {
      case "en":
        return `I feel ${words[0]}`;
      case "fr":
        return `Je me sens ${words[0]}`;
      case "ar":
        return `أشعر بـ ${words[0]}`;
      case "ro":
        return `Mă simt ${words[0]}`;
    }
  }

  // ---------------------------------------------
  // WANT / EAT / DRINK → auto-add subject
  // ---------------------------------------------
  if (wants.includes(words[0]) && words.length > 1) {
    const obj = words.slice(1).join(" ");

    switch (locale) {
      case "en":
        return `I want ${obj}`;
      case "fr":
        return `Je veux ${obj}`;
      case "ar":
        return `أريد ${obj}`;
      case "ro":
        return `Vreau ${obj}`;
    }
  }

  // ---------------------------------------------
  // SUBJECT + VERB → reorder properly
  // Ex: "want juice" → "I want juice"
  // ---------------------------------------------
  if (!subjects.includes(words[0]) && wants.includes(words[0])) {
    const subject = "i";

    switch (locale) {
      case "en":
        return `I ${words.join(" ")}`;
      case "fr":
        return `Je ${words.join(" ")}`;
      case "ar":
        return `أنا ${words.join(" ")}`;
      case "ro":
        return `Eu ${words.join(" ")}`;
    }
  }

  // ---------------------------------------------
  // DEFAULT FALLBACK → join words manually
  // ---------------------------------------------
  sentence = words.join(" ");

  // ---------------------------------------------
  // CLEANUP: First letter uppercase + period
  // ---------------------------------------------
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  if (!sentence.endsWith(".")) sentence += ".";

  return sentence;
}
