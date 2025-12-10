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
  lang: string;       // default TTS voice (not actively used here)
  category: string;   // main AAC category: food, drink, people...
  order: number;      // sort order inside a group/category
  group?: string;     // ⭐ NEW: semantic group, e.g. "meal", "snack", "family"
}

interface TileProps {
  tile: TileData;
  locale: string;
  onSpeak: (text: string, locale: string) => void;
  onSelect?: () => void; // optional: for sentence builder
}

export default function Tile({ tile, locale, onSpeak, onSelect }: TileProps) {
  const text = tile.translations?.[locale] || tile.word;

  const handleClick = () => {
    onSpeak(text, locale);
    if (onSelect) onSelect();
  };

  return (
    <div
      className={styles.tile}
      onClick={handleClick}
    >
      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
