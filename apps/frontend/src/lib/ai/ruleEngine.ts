// src/lib/ai/ruleEngine.ts
import type { TileData } from "@/components/Tile";
import type { AIContext, SuggestionResult } from "./types";

/* ============================
   HELPERS (ID SAFE)
============================ */

const uniqById = (tiles: TileData[]) => {
  const seen = new Set<number>();
  const out: TileData[] = [];

  for (const t of tiles) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }
  return out;
};

const notAlreadyInSentence = (
  tiles: TileData[],
  sentenceIds: number[]
) => tiles.filter((t) => !sentenceIds.includes(t.id));

const filterAllowed = (
  tiles: TileData[],
  allowedIds?: number[]
) => {
  if (!allowedIds?.length) return tiles;
  const allowed = new Set<number>(allowedIds);
  return tiles.filter((t) => allowed.has(t.id));
};

function pickTopByUsage(
  tiles: TileData[],
  usageCounts?: Record<number, number>
) {
  if (!usageCounts) return tiles;

  return [...tiles].sort(
    (a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0)
  );
}

function byCategory(candidateTiles: TileData[], categories: string[]) {
  const set = new Set(categories);
  return candidateTiles.filter(
    (t) => t.category && set.has(t.category)
  );
}

function byGroup(candidateTiles: TileData[], groups: string[]) {
  const set = new Set(groups);
  return candidateTiles.filter(
    (t) => t.group && set.has(t.group)
  );
}

function hasToken(ctx: AIContext, token: string) {
  return ctx.tokens.includes(token);
}

function lastToken(ctx: AIContext) {
  return ctx.tokens[ctx.tokens.length - 1] || "";
}

/* ============================
   RULE ENGINE — PHASE 6.0
============================ */

export function suggestNextByRules(params: {
  ctx: AIContext;
  candidateTiles: TileData[];
}): SuggestionResult {
  const { ctx } = params;
  let candidates = params.candidateTiles;

  // Safety filters
  candidates = filterAllowed(candidates, ctx.allowedTileIds);
  candidates = notAlreadyInSentence(candidates, ctx.sentenceTileIds);

  // 0️⃣ No sentence → starters
  if (!ctx.tokens.length) {
    const starters = byCategory(candidates, [
      "help",
      "feelings",
      "actions",
      "food",
      "drink",
      "people",
    ]);

    const ranked = pickTopByUsage(
      starters,
      ctx.usage.countsByTileId
    );

    return {
      suggestions: uniqById(ranked).slice(0, 8),
      confidence: 0.55,
      source: "rules",
    };
  }

  const last = lastToken(ctx);

  // 1️⃣ Help intent
  if (last.includes("help") || hasToken(ctx, "help")) {
    const helpTiles = byCategory(candidates, ["help"]);
    const ranked = pickTopByUsage(
      helpTiles,
      ctx.usage.countsByTileId
    );

    return {
      suggestions: uniqById(ranked).slice(0, 8),
      confidence: 0.65,
      source: "rules",
    };
  }

  // 2️⃣ Short sentence → common things
  if (ctx.tokens.length <= 2) {
    const common = byCategory(candidates, [
      "food",
      "drink",
      "actions",
      "feelings",
      "people",
    ]);

    const ranked = pickTopByUsage(
      common,
      ctx.usage.countsByTileId
    );

    return {
      suggestions: uniqById(ranked).slice(0, 8),
      confidence: 0.5,
      source: "rules",
    };
  }

  // 3️⃣ Objects fallback
  const objects = byCategory(candidates, [
    "food",
    "drink",
    "people",
  ]);

  if (objects.length) {
    const ranked = pickTopByUsage(
      objects,
      ctx.usage.countsByTileId
    );

    return {
      suggestions: uniqById(ranked).slice(0, 8),
      confidence: 0.45,
      source: "rules",
    };
  }

  // 4️⃣ Final fallback
  const ranked = pickTopByUsage(
    candidates,
    ctx.usage.countsByTileId
  );

  return {
    suggestions: uniqById(ranked).slice(0, 8),
    confidence: 0.35,
    source: "rules",
  };
}
