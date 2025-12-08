'use client';

import styles from "./Tile.module.scss";

export interface TileData {
  id: number;
  word: string;
  translations: {
    en?: string;
    fr?: string;
    ar?: string;
  };
  imageUrl?: string;
  lang: string;       // default TTS voice (not actively used here)
  category: string;
  order: number;
}

interface TileProps {
  tile: TileData;
  locale: string;
  onSpeak: (text: string, locale: string) => void;
}

export default function Tile({ tile, locale, onSpeak }: TileProps) {
  const text =
    tile.translations?.[locale] ||
    tile.word;

  return (
    <div
      className={styles.tile}
      onClick={() => onSpeak(text, locale)}
    >
      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
