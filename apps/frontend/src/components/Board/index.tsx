"use client";

import { useState } from "react";
import Tile from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";
import TilePreviewModal from "@/components/TilePreviewModal";
import { useUsageTracker } from "@/hooks/useUsageTracker";
import type { TileData } from "@/types/tile";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

interface BoardProps {
  tiles: TileData[];
  onTileSelect: (tile: TileData) => void;
}

export default function Board({ tiles, onTileSelect }: BoardProps) {
  const { speak } = useTTS();
  const { t } = useTranslation();
  const { trackTile } = useUsageTracker();

  const [previewTile, setPreviewTile] = useState<TileData | null>(null);

  return (
    <>
      <div className={styles.board}>
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
      </div>

      {previewTile && (
        <TilePreviewModal
          tile={previewTile}
          onClose={() => setPreviewTile(null)}
          onAdd={(tile) => {
            trackTile(tile);
            onTileSelect(tile);
            setPreviewTile(null);
          }}
        />
      )}
    </>
  );
}