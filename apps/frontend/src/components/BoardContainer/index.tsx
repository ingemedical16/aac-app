"use client";

import { useState } from "react";
import Tile from "@/components/Tile";
import BoardGrid from "@/components/BoardGrid";
import TilePreviewModal from "@/components/TilePreviewModal";

import useTTS from "@/hooks/useTTS";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

import type { TileData } from "@/types/tile";
import type { BoardCapabilities } from "@/types/boardCapabilities";

interface BoardContainerProps {
  tiles: TileData[];
  onTileSelect: (tile: TileData) => void;
  capabilities?: BoardCapabilities | null;
}

export default function BoardContainer({
  tiles,
  onTileSelect,
  capabilities,
}: BoardContainerProps) {
  const { speak } = useTTS();
  const { t } = useTranslation();
  const { trackTile } = useUsageTracker();

  const [previewTile, setPreviewTile] = useState<TileData | null>(null);

  /* =========================
     SAFETY DEFAULTS
  ========================= */
  const canPreview = capabilities?.canAddTiles ?? true;
  const canSpeak = true; // speaking is always allowed
  const canTrack = capabilities?.canViewStats ?? false;

  return (
    <>
      <BoardGrid>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            onSpeak={
              canSpeak
                ? () => speak(t(tx("tiles", tile.translateKey)))
                : undefined
            }
            onSelect={(t) => {
              if (canTrack) trackTile(t);
              onTileSelect(t);
            }}
            onLongPress={
              canPreview ? (t) => setPreviewTile(t) : undefined
            }
          />
        ))}
      </BoardGrid>

      {/* 🔍 Tile preview (optional, capability-based) */}
      {previewTile && canPreview && (
        <TilePreviewModal
          tile={previewTile}
          onClose={() => setPreviewTile(null)}
          onAdd={(tile) => {
            if (canTrack) trackTile(tile);
            onTileSelect(tile);
            setPreviewTile(null);
          }}
        />
      )}
    </>
  );
}