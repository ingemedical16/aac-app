"use client";

import { useState } from "react";
import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";
import TilePreviewModal from "@/components/TilePreviewModal";
import { useUsageTracker } from "@/hooks/useUsageTracker";

interface BoardProps {
  tiles: TileData[];
  locale: string;
  onTileSelect: (tile: TileData) => void;
}

export default function Board({ tiles, locale, onTileSelect }: BoardProps) {
  const { speak } = useTTS();
  const { trackTile } = useUsageTracker();
  const [previewTile, setPreviewTile] = useState<TileData | null>(null);

  return (
    <>
      <div className={styles.board}>
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            locale={locale}
            onSpeak={(text) => speak(text, locale)}
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
          locale={locale}
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
