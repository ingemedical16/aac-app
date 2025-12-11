"use client";

import Tile, { TileData } from "@/components/Tile";
import styles from "./Board.module.scss";

interface BoardProps {
  tiles: TileData[];
  locale: string;
  onTileSelect: (tile: TileData) => void;
}

export default function Board({ tiles, locale, onTileSelect }: BoardProps) {
  return (
    <div className={styles.board}>
      {tiles
        .sort((a, b) => a.order - b.order)
        .map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            locale={locale}
            onSelect={onTileSelect}
          />
        ))}
    </div>
  );
}
