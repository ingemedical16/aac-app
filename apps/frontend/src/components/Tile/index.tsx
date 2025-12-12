"use client";
import { useHighContrast } from "@/context/HighContrastContext";

import styles from "./Tile.module.scss";

export interface TileData {
  id: number;
  word: string;
  translations: Record<string, string>;
  imageUrl?: string;
  lang: string;
  category: string;
  order: number;
  group?: string;
}

interface Props {
  tile: TileData;
  locale: string;
  onSpeak?: (text: string) => void;
  onSelect?: (tile: TileData) => void;
  onLongPress?: (tile: TileData) => void;
}

export default function Tile({
  tile,
  locale,
  onSpeak,
  onSelect,
  onLongPress,
}: Props) {
  const text = tile.translations?.[locale] ?? tile.word;
  const { highContrast } = useHighContrast();

  let pressTimer: any;

  function handleDown() {
    pressTimer = setTimeout(() => {
      onLongPress?.(tile);
    }, 450);
  }

  function handleUp() {
    clearTimeout(pressTimer);
  }

  function handleClick() {
    onSpeak?.(text);
    onSelect?.(tile);
  }

  return (
    <div
      className={`${styles.tile} ${highContrast ? styles.highContrastTile : ""}`}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchEnd={handleUp}
      onClick={handleClick}
    >
      {tile.imageUrl && (
        <img
          src={tile.imageUrl}
          alt={text}
          className={styles.image}  
          draggable={false}
        />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
