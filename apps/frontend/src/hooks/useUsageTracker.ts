"use client";

import { TileData } from "@/components/Tile";

const usageMap = new Map<number, number>();

export function useUsageTracker() {
  function trackTile(tile: TileData) {
    usageMap.set(tile.id, (usageMap.get(tile.id) ?? 0) + 1);
  }

  function getUsage(tileId: number) {
    return usageMap.get(tileId) ?? 0;
  }

  return { trackTile, getUsage };
}
