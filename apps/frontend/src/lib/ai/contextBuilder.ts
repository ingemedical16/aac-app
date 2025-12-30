import type { TileData } from "@/types/tile";
import type { AIContext } from "./types";
import type { Profile } from "@/types/userProfile";

export function buildAIContext(params: {
  sentence: TileData[];
  locale: string;
  profile: Profile;
  grammarMode?: "simple" | "full" | "smart";
  allowedTileIds?: string[];
}): AIContext {
  const { sentence, locale, profile, grammarMode = "simple", allowedTileIds } = params;

  return {
    locale,
    role: profile.role,
    grammarMode,
    tokens: sentence.map((t) => t.translateKey),
    sentenceTileIds: sentence.map((t) => t.id),
    allowedTileIds,
  };
}
