"use client";

import styles from "./TilePreviewModal.module.scss";
import type { TileData } from "@/types/tile";
import { useTranslation } from "react-i18next";
import useTTS from "@/hooks/useTTS";

interface Props {
  tile: TileData | null;
  locale: string;
  onClose: () => void;
  onAdd: (tile: TileData) => void;
}

export default function TilePreviewModal({
  tile,
  locale,
  onClose,
  onAdd,
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation("common");

  if (!tile) return null;

  const text = tile.translations?.[locale] || tile.word;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          ✖
        </button>

        <img src={tile.imageUrl} alt={text} className={styles.image} />

        <h2 className={styles.title}>{text}</h2>

        <div className={styles.buttons}>
          <button className={styles.speak} onClick={() => speak(text, locale)}>
            🔊 {t("speak")}
          </button>

          <button className={styles.add} onClick={() => onAdd(tile)}>
            ➕ {t("addToSentence")}
          </button>

          <button className={styles.editDisabled} disabled>
            ✏️ {t("edit")}
          </button>
        </div>
      </div>
    </div>
  );
}
