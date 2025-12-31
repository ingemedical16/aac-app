"use client";

import styles from "./TilePreviewModal.module.scss";
import type { TileData } from "@/types/tile";
import { useTranslation } from "react-i18next";
import useTTS from "@/hooks/useTTS";
import { tx } from "@/lib/i18n/tx";

interface Props {
  tile: TileData | null;
  onClose: () => void;
  onAdd: (tile: TileData) => void;
}

export default function TilePreviewModal({
  tile,
  onClose,
  onAdd,
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation();

  if (!tile) return null;

  const label = t(tx("tiles", tile.translateKey));

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.close}
          onClick={onClose}
          aria-label={t("close")}
        >
          ✖
        </button>

        {tile.imageUrl && (
          <img
            src={tile.imageUrl}
            alt={label}
            className={styles.image}
          />
        )}

        <h2 className={styles.title}>{label}</h2>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.speak}
            onClick={() => speak(label)}
            aria-label={t("speak")}
          >
            🔊 {t("speak")}
          </button>

          <button
            type="button"
            className={styles.add}
            onClick={() => onAdd(tile)}
            aria-label={t("addToSentence")}
          >
            ➕ {t("addToSentence")}
          </button>

          <button
            type="button"
            className={styles.editDisabled}
            disabled
            aria-disabled="true"
          >
            ✏️ {t("edit")}
          </button>
        </div>
      </div>
    </div>
  );
}