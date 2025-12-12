"use client";

import { useState } from "react";
import styles from "./SentenceBar.module.scss";

import useTTS from "@/hooks/useTTS";
import {
  buildSentence,
  type SentencePhraseSet,
  type GrammarMode,
} from "@/lib/sentenceBuilder";
import { TileData } from "@/components/Tile";
import { useHighContrast } from "@/context/HighContrastContext";
import { useTranslation } from "react-i18next";

interface Props {
  sentence: TileData[];
  locale: string;
  onClear: () => void;
  onDeleteLast: () => void;
  // Ready for Option C: both modes (simple / full).
  grammarMode?: GrammarMode;
}

export default function SentenceBar({
  sentence,
  locale,
  onClear,
  onDeleteLast,
  grammarMode = "simple", // we can later expose a toggle in the UI
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation("common");
  const [isSpeaking, setIsSpeaking] = useState(false);
   const { highContrast } = useHighContrast();

  // Build phrase set from i18n → multilingual parity EN / FR / AR / RO
  const phrases: SentencePhraseSet = {
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

  const fullSentence = buildSentence(sentence, locale, phrases, grammarMode);

  const handleSpeak = () => {
    if (!fullSentence) return;
    setIsSpeaking(true);
    speak(fullSentence, locale, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div
      className={`${styles.bar} ${highContrast ? styles.highContrast : ""} ${
        isSpeaking ? styles.barSpeaking : ""
      }`}
    >
      {/* WORD LIST */}
      <div className={styles.words}>
        {sentence.map((tile) => (
          <span key={tile.id} className={styles.word}>
            {tile.translations?.[locale] || tile.word}
          </span>
        ))}

        {/* Optional hint for therapists (future dashboard) */}
        {sentence.length === 0 && (
          <span className={styles.hint}>
            {t("tapToSpeak")}
          </span>
        )}
      </div>

      {/* BUTTONS */}
      <div className={styles.buttons}>
        <button
          className={styles.speak}
          onClick={handleSpeak}
          disabled={!fullSentence}
        >
          🔊 {t("speak")}
        </button>

        <button
          className={styles.deleteLast}
          onClick={onDeleteLast}
          disabled={sentence.length === 0}
        >
          ⬅️ {t("deleteLast")}
        </button>

        <button
          className={styles.clear}
          onClick={onClear}
          disabled={sentence.length === 0}
        >
          ❌ {t("clear")}
        </button>
      </div>
    </div>
  );
}
