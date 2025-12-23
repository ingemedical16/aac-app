// src/lib/ai/types.ts
import type { TileData } from "@/components/Tile";
import type { LocaleCode, ProfileRole, Profile } from "@/types/userProfile";

export type TileId = number; // ✅ SUPPORT BOTH

export type SuggestionSource = "rules" | "ai";

export interface TileUsageStats {
  countsByTileId?: Record<TileId, number>;
  lastUsedTileIds?: TileId[];
}

export interface AIContext {
  locale: LocaleCode;
  role: ProfileRole;
  grammarMode: "simple" | "full" | "smart";

  tokens: string[];

  sentenceTileIds: TileId[]; // ✅ FIXED

  usage: TileUsageStats;
  allowedTileIds?: TileId[];
}

export interface SuggestionResult {
  suggestions: TileData[];
  confidence: number;
  source: SuggestionSource;
}

export interface SuggestionInput {
  sentence: TileData[];
  locale: LocaleCode;
  profile: Profile;
  grammarMode?: "simple" | "full" | "smart";
  candidateTiles?: TileData[];
  usage?: TileUsageStats;
}
