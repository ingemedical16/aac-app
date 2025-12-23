import type { TileData } from "@/components/Tile";
import type { AIContext, TileUsageStats } from "./types";
import type { LocaleCode, Profile } from "@/types/userProfile";

function normalizeToken(s: string) {
  return (s || "").trim().toLowerCase();
}

function getToken(tile: TileData, locale: LocaleCode) {
  return (tile.translations?.[locale] || tile.word || "").toString();
}

/**
 * Phase 6.1
 * Single source of truth for AI context creation
 */
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

  const tokens = sentence.map((t) =>
    normalizeToken(getToken(t, locale))
  );

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
