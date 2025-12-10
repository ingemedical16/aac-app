"use client";

import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";

interface BoardProps {
  tiles: TileData[];                 // loaded from data / API
  locale: string;                    // current UI language
  onTileSelect?: (tile: TileData) => void; // optional: used by SentenceBar
}

export default function Board({ tiles, locale, onTileSelect }: BoardProps) {
  const { speak } = useTTS();

  const handleSpeak = (text: string, locale: string) => {
    speak(text, locale);
  };

  return (
    <div className={styles.board}>
      {tiles
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            locale={locale}
            onSpeak={handleSpeak}
            onSelect={
              onTileSelect
                ? () => onTileSelect(tile)
                : undefined
            }
          />
        ))}
    </div>
  );
}
