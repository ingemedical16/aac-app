"use client";

import styles from "./SentenceBar.module.scss";
import useTTS from "@/hooks/useTTS";
import { buildSentence } from "@/lib/sentenceBuilder";
import { TileData } from "@/components/Tile";
import { useTranslation } from "react-i18next";

interface Props {
  sentence: TileData[];
  locale: string;
  onClear: () => void;
  onDeleteLast: () => void;
}

export default function SentenceBar({
  sentence,
  locale,
  onClear,
  onDeleteLast,
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation("common");

  // 🧠 Grammar Engine v3 — now using translation system
  const fullSentence = buildSentence(sentence, locale, t);

  return (
    <div className={styles.bar}>
      {/* --- Word List --- */}
      <div className={styles.words}>
        {sentence.map((tile) => (
          <span key={tile.id} className={styles.word}>
            {tile.translations?.[locale] || tile.word}
          </span>
        ))}
      </div>

      {/* --- Buttons --- */}
      <div className={styles.buttons}>
        <button
          className={styles.speak}
          disabled={!sentence.length}
          onClick={() => speak(fullSentence, locale)}
        >
          🔊 {t("speak")}
        </button>

        <button
          className={styles.deleteLast}
          disabled={!sentence.length}
          onClick={onDeleteLast}
        >
          ⬅️ {t("deleteLast")}
        </button>

        <button
          className={styles.clear}
          disabled={!sentence.length}
          onClick={onClear}
        >
          ❌ {t("clear")}
        </button>
      </div>
    </div>
  );
}
