"use client";

import Tile, { TileData } from "@/components/Tile";
import useTTS from "@/hooks/useTTS";
import styles from "./Board.module.scss";

interface BoardProps {
  tiles: TileData[];
  locale: string;
  onTileSelect: (tile: TileData) => void;
}

export default function Board({ tiles, locale, onTileSelect }: BoardProps) {
  const { speak } = useTTS();

  const handleSpeak = (text: string, locale: string) => {
    speak(text, locale);
  };

  return (
    <div className={styles.board}>
      {tiles
        .sort((a, b) => a.order - b.order)
        .map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            locale={locale}
            onSpeak={handleSpeak}
            onSelect={() => onTileSelect(tile)}
          />
        ))}
    </div>
  );
}
