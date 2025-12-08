'use client';

import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";

interface BoardProps {
  tiles: TileData[];     // loaded from API in the future
  locale: string;        // passed from the route layout
}

export default function Board({ tiles, locale }: BoardProps) {
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
          />
        ))}
    </div>
  );
}
