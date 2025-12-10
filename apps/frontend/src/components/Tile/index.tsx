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
  kind: "action" | "food" | "drink" | "feeling" | "people" | "helper";
}

interface TileProps {
  tile: TileData;
  locale: string;
  onSpeak: (text: string, locale: string) => void;
  onSelect: () => void;
}

export default function Tile({ tile, locale, onSpeak, onSelect }: TileProps) {
  const text = tile.translations?.[locale] || tile.word;

  return (
    <div
      className={styles.tile}
      onClick={() => {
        onSpeak(text, locale);
        onSelect();
      }}
    >
      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}
      <div className={styles.label}>{text}</div>
    </div>
  );
}
