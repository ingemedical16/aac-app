"use client";

import type { TileData } from "@/types/tile";

const usageMap = new Map<string, number>();

export function useUsageTracker() {
  function trackTile(tile: TileData) {
    const current = usageMap.get(tile.id) ?? 0;
    usageMap.set(tile.id, current + 1);
  }

  function getUsage(tileId: string): number {
    return usageMap.get(tileId) ?? 0;
  }

  return { trackTile, getUsage };
}
