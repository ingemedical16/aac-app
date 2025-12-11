"use client";

import { useRef } from "react";
import styles from "./Tile.module.scss";
import { TileData } from "@/components/Tile";

interface TileProps {
  tile: TileData;
  locale: string;
  onSpeak: (text: string, locale: string) => void;
  onSelect: (tile: TileData) => void;
  onLongPress: (tile: TileData) => void;
}

export default function Tile({ tile, locale, onSpeak, onSelect, onLongPress }: TileProps) {
  const text = tile.translations?.[locale] || tile.word;
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      onLongPress(tile); // OPEN PREVIEW MODAL
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = () => {
    // If long press already triggered, do nothing
    if (pressTimer.current === null) return;

    onSpeak(text, locale);
    onSelect(tile);
  };

  return (
    <div
      className={styles.tile}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
    >
      {tile.imageUrl && (
        <img src={tile.imageUrl} alt={text} className={styles.image} />
      )}

      <div className={styles.label}>{text}</div>
    </div>
  );
}
