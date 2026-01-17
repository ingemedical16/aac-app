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
}

export default function BoardContainer({
  tiles,
  onTileSelect,
}: BoardContainerProps) {
  const { speak } = useTTS();
  const { t } = useTranslation();
  const { trackTile } = useUsageTracker();

  const [previewTile, setPreviewTile] = useState<TileData | null>(null);

  /* =========================
     SAFETY DEFAULTS
  ========================= */


  return (
    <>
      <BoardGrid>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            onSpeak={() => speak(t(tx("tiles", tile.translateKey)))}
            onSelect={(t) => {
              trackTile(t);
              onTileSelect(t);
            }}
            onLongPress={(t) => setPreviewTile(t)}
          />
        ))}
      </BoardGrid>

    
        <TilePreviewModal
          tile={previewTile}
          onClose={() => setPreviewTile(null)}
          onAdd={(tile) => {
            trackTile(tile);
            onTileSelect(tile);
            setPreviewTile(null);
          }}
        />
      
    </>
  );
}