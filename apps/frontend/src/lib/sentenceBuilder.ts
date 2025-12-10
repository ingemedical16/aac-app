import { TileData } from "@/components/Tile";

export function buildSentence(tiles: TileData[], locale: string): string {
  if (!tiles.length) return "";

  const words = tiles.map((t) => t.translations?.[locale] || t.word);
  const kinds = tiles.map((t) => t.kind);

  // FEELINGS → "I feel sad"
  if (kinds[0] === "feeling") {
    return phrase(locale, "feel") + " " + words[0];
  }

  // ACTION + OBJECT → "I want to drink water"
  if (kinds[0] === "action" && words[1]) {
    return (
      phrase(locale, "want") + " " + translateTo(locale) + " " + words.join(" ")
    );
  }

  // Helper phrases (Stop, Help, Again…)
  if (kinds[0] === "helper") {
    return words[0];
  }

  // Default fallback
  return phrase(locale, "want") + " " + words.join(" ");
}

function phrase(locale: string, key: string) {
  const lang: Record<string, any> = {
    en: { want: "I want", feel: "I feel" },
    fr: { want: "Je veux", feel: "Je me sens" },
    ar: { want: "أريد", feel: "أشعر بـ" },
    ro: { want: "Vreau", feel: "Mă simt" },
  };

  return lang[locale]?.[key] || lang["en"][key];
}

function translateTo(locale: string) {
  return locale === "en"
    ? "to"
    : locale === "fr"
    ? "à"
    : locale === "ar"
    ? "أن"
    : locale === "ro"
    ? "să"
    : "to";
}
