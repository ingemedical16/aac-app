"use client";

import { useState } from "react";
import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";
import TilePreviewModal from "@/components/TilePreviewModal";

interface BoardProps {
  tiles: TileData[];
  locale: string;
  onTileSelect: (tile: TileData) => void;
}

export default function Board({ tiles, locale, onTileSelect }: BoardProps) {
  const { speak } = useTTS();
  const [previewTile, setPreviewTile] = useState<TileData | null>(null);

  const handleSpeak = (text: string, locale: string) => {
    speak(text, locale);
  };

  return (
    <>
      <div className={styles.board}>
        {tiles
          .sort((a, b) => a.order - b.order)
          .map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              locale={locale}
              onSpeak={handleSpeak}
              onSelect={onTileSelect}
              onLongPress={(tile) => setPreviewTile(tile)}
            />
          ))}
      </div>

      {/* MODAL */}
      {previewTile && (
        <TilePreviewModal
          tile={previewTile}
          locale={locale}
          onClose={() => setPreviewTile(null)}
          onAdd={(tile) => {
            onTileSelect(tile);
            setPreviewTile(null);
          }}
        />
      )}
    </>
  );
}
