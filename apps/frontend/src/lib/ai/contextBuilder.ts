// src/lib/ai/contextBuilder.ts
import type { TileData } from "@/components/Tile";
import type { AIContext, TileUsageStats } from "./types";
import type { LocaleCode, Profile } from "@/types/userProfile";

function normalizeToken(s: string) {
  return (s || "").trim().toLowerCase();
}

function tf(tile: TileData, locale: LocaleCode) {
  return (tile.translations?.[locale] || tile.word || "").toString();
}

export function buildAIContext(params: {
  sentence: TileData[];
  locale: LocaleCode;
  profile: Profile;
  grammarMode?: "simple" | "full" | "smart";
  usage?: TileUsageStats;
  allowedTileIds?: number[];
}): AIContext {
  const {
    sentence,
    locale,
    profile,
    grammarMode = "simple",
    usage = {},
    allowedTileIds,
  } = params;

  const tokens = sentence.map((t) => normalizeToken(tf(t, locale)));
  const sentenceTileIds = sentence.map((t) => t.id);

  return {
    locale,
    role: profile.role,
    grammarMode,
    tokens,
    sentenceTileIds,
    usage,
    allowedTileIds,
  };
}
