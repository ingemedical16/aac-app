"use client";

import styles from "./Tile.module.scss";

export interface TileData {
  id: number;
  word: string;
  translations: { en?: string; fr?: string; ar?: string; ro?: string };
  imageUrl?: string;
  lang: string;
  category: string;
  order: number;
}

interface TileProps {
  tile: TileData;
  locale: string;
  onSpeak: (text: string, locale: string) => void;
  onSelect?: (tile: TileData) => void;
  editMode?: boolean; // NEW
}

export default function Tile({
  tile,
  locale,
  onSpeak,
  onSelect,
  editMode = false,
}: TileProps) {
  const text = tile.translations?.[locale] || tile.word;

  const handleClick = () => {
    if (editMode) {
      alert(`Edit mode: ${text}`);
      console.log("Edit tile:", tile);
      return;
    }

    onSpeak(text, locale);
    onSelect?.(tile);
  };

  return (
    <div className={styles.tile} onClick={handleClick}>
      {editMode && <div className={styles.editBadge}>✎</div>}

      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
