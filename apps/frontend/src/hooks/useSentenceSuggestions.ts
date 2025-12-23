// src/hooks/useSentenceSuggestions.ts
"use client";

import { useMemo } from "react";
import type { TileData } from "@/components/Tile";
import type { LocaleCode, Profile } from "@/types/userProfile";
import { buildAIContext } from "@/lib/ai/contextBuilder";
import { suggestNextByRules } from "@/lib/ai/ruleEngine";
import type { SuggestionResult, TileUsageStats } from "@/lib/ai/types";

type Args = {
  sentence: TileData[];
  locale: LocaleCode;
  profile: Profile;
  candidateTiles: TileData[]; // pass filteredTiles or full tiles later
  grammarMode?: "simple" | "full" | "smart";
  usage?: TileUsageStats;
  allowedTileIds?: number[];
};

export function useSentenceSuggestions({
  sentence,
  locale,
  profile,
  candidateTiles,
  grammarMode = "simple",
  usage,
  allowedTileIds,
}: Args): SuggestionResult {
  return useMemo(() => {
    // Phase 6.0: children are rules-only by default (safe)
    const ctx = buildAIContext({
      sentence,
      locale,
      profile,
      grammarMode,
      usage,
      allowedTileIds,
    });

    // Phase 6.0: rules only
    return suggestNextByRules({
      ctx,
      candidateTiles,
    });
  }, [sentence, locale, profile, candidateTiles, grammarMode, usage, allowedTileIds]);
}
