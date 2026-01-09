"use client";

import styles from "./Tile.module.scss";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/context/UserProfileContext";
import type { TileData } from "@/types/tile";
import { tx } from "@/lib/i18n/tx";

interface Props {
  tile: TileData;
  onSpeak?: (text: string) => void;
  onSelect?: (tile: TileData) => void;
  onLongPress?: (tile: TileData) => void;
}

export default function Tile({ tile, onSpeak, onSelect, onLongPress }: Props) {
  const { t } = useTranslation();
  const { profile } = useUserProfile();

  const label = t(tx("tiles", tile.translateKey));

  let timer: any;

  const handleDown = () => {
    timer = setTimeout(() => onLongPress?.(tile), 450);
  };

  const handleUp = () => clearTimeout(timer);

  const handleClick = () => {
    onSpeak?.(label);
    onSelect?.(tile);
  };

  return (
    <div
      className={`${styles.tile} ${
        profile.highContrast ? styles.highContrastTile : ""
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
        <img src={tile.imageUrl} alt={label} className={styles.image} />
      )}
      <div className={styles.label}>{label}</div>
    </div>
  );
}
