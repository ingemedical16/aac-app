"use client";

import styles from "./Tile.module.scss";
import { useUserProfile } from "@/context/UserProfileContext";

export interface TileData {
  id: number ;
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
  const { profile } = useUserProfile();
  const text = tile.translations?.[locale] ?? tile.word;

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
      className={`${styles.tile} ${
        profile.settings.highContrast ? styles.highContrastTile : ""
      }`}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchEnd={handleUp}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {tile.imageUrl && (
        <img className={styles.image} src={tile.imageUrl} alt={text} />
      )}
      <div className={styles.label}>{text}</div>
    </div>
  );
}
