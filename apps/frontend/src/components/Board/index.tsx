"use client";

import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";
import useTTS from "@/hooks/useTTS";

interface BoardProps {
  tiles: TileData[];
  locale: string;
  onTileSelect: (tile: TileData) => void;
  onTileLongPress: (tile: TileData) => void;
}

export default function Board({
  tiles,
  locale,
  onTileSelect,
  onTileLongPress,
}: BoardProps) {
  const { speak } = useTTS();

  const handleSpeak = (text: string, locale: string) => {
    speak(text, locale);
  };

  return (
    <div className={styles.board}>
      {tiles
        .sort((a, b) => a.order - b.order)
        .map((tile) => {
          const text = tile.translations?.[locale] || tile.word;

          return (
            <Tile
              key={tile.id}
              tile={tile}
              locale={locale}
              onSpeak={() => handleSpeak(text, locale)}
              onSelect={() => onTileSelect(tile)}
              onLongPress={() => onTileLongPress(tile)}
            />
          );
        })}
    </div>
  );
}
