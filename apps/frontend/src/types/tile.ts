// src/types/tile.ts
import type { SemanticToken } from "@/lib/ai/semantic";

export interface TileData {
  /** 🔑 DB / React / AI safe */
  id: string;

  /** Stable translation key */
  translateKey: string; // e.g. "tile.food.bread"

  /** Category + group keys */
  categoryKey?: string; // "category.food"
  groupKey?: string;    // "group.mealBasics"

  /** Semantic meaning for AI */
  semantic?: SemanticToken;

  /** UI */
  imageUrl?: string;
  order?: number;
}
