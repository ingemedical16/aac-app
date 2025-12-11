"use client";

import styles from "./Tile.module.scss";

export interface TileData {
  id: number;
  word: string;
  translations: {
    en?: string;
    fr?: string;
    ar?: string;
    ro?: string;
  };
  imageUrl?: string;
  lang: string;
  category: string;
  order: number;
}

interface TileProps {
  tile: TileData;
  locale: string;
  onSelect: (tile: TileData) => void;
}

export default function Tile({ tile, locale, onSelect }: TileProps) {
  const text = tile.translations?.[locale] || tile.word;

  const handleClick = () => {
    onSelect(tile); // ← ADD TILE TO SENTENCE
  };

  return (
    <div className={styles.tile} onClick={handleClick}>
      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
