"use client";

import styles from "./SentenceBar.module.scss";
import useTTS from "@/hooks/useTTS";
import { buildSentence } from "@/lib/sentenceBuilder";
import { TileData } from "@/components/Tile";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

  const [isSpeaking, setIsSpeaking] = useState(false);

  const fullSentence = buildSentence(sentence, locale, t);

  const handleSpeak = () => {
    if (!fullSentence.trim()) return;

    setIsSpeaking(true);

    speak(fullSentence, locale, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className={`${styles.bar} ${isSpeaking ? styles.speaking : ""}`}>
      {/* Selected tiles turned into sentence preview */}
      <div className={styles.words}>
        {sentence.map((tile) => (
          <span key={tile.id} className={styles.word}>
            {tile.translations?.[locale] || tile.word}
          </span>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.speak} onClick={handleSpeak}>
          🔊 {t("speak")}
        </button>

        <button className={styles.deleteLast} onClick={onDeleteLast}>
          ⬅️ {t("deleteLast")}
        </button>

        <button className={styles.clear} onClick={onClear}>
          ❌ {t("clear")}
        </button>
      </div>
    </div>
  );
}
