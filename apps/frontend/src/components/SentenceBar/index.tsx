// apps/frontend/src/components/SentenceBar/index.tsx
"use client";

import { useState } from "react";
import styles from "./SentenceBar.module.scss";
import useTTS from "@/hooks/useTTS";
import { buildSentence, PhraseSet } from "@/lib/sentenceBuilder";
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

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Build phrase set from i18n (React hook usage is here, not in the engine)
  const phrases: PhraseSet = {
    iWant: t("iWant"),
    iDontWant: t("iDontWant"),
    iNeedHelp: t("iNeedHelp"),
    help: t("help"),
    iFeel: t("iFeel"),
    stop: t("stop"),
    more: t("more"),
    again: t("again"),
    to: t("to"),
    toGoTo: t("toGoTo"),
    period: t("period"),
  };

  const fullSentence = buildSentence(sentence, locale, phrases);

  const handleSpeak = () => {
    if (!fullSentence) return;
    setIsSpeaking(true);
    // useTTS supports onEnd callback (visual feedback)
    speak(fullSentence, locale, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div
      className={`${styles.bar} ${isSpeaking ? styles.speaking : ""}`}
      aria-label={t("boardTitle")}
    >
      {/* WORD LIST */}
      <div className={styles.words}>
        {sentence.map((tile) => (
          <span key={tile.id} className={styles.word}>
            {tile.translations?.[locale] || tile.word}
          </span>
        ))}

        {/* Small hint for therapists / parents */}
        {sentence.length === 0 && (
          <span className={styles.hint}>
            {t("tapToSpeak", "Tap tiles to build a sentence")}
          </span>
        )}
      </div>

      {/* BUTTONS */}
      <div className={styles.buttons}>
        <button
          className={styles.speak}
          type="button"
          onClick={handleSpeak}
          disabled={!fullSentence}
        >
          🔊 {t("speak")}
        </button>

        <button
          className={styles.deleteLast}
          type="button"
          onClick={onDeleteLast}
          disabled={sentence.length === 0}
        >
          ⬅️ {t("deleteLast")}
        </button>

        <button
          className={styles.clear}
          type="button"
          onClick={onClear}
          disabled={sentence.length === 0}
        >
          ❌ {t("clear")}
        </button>
      </div>
    </div>
  );
}
