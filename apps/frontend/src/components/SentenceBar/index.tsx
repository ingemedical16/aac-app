"use client";

import { useState } from "react";
import styles from "./SentenceBar.module.scss";

import useTTS from "@/hooks/useTTS";
import { buildSentence, type GrammarMode } from "@/lib/sentenceBuilder";
import { TileData } from "@/components/Tile";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

interface Props {
  sentence: TileData[];
  locale: "en" | "fr" | "ar" | "ro";
  onClear: () => void;
  onDeleteLast: () => void;
  grammarMode?: GrammarMode;
}

export default function SentenceBar({
  sentence,
  locale,
  onClear,
  onDeleteLast,
  grammarMode = "simple",
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation("common");
  const { profile } = useUserProfile();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ correct signature (3 args)
  const fullSentence = buildSentence(sentence, locale, grammarMode);

  const handleSpeak = () => {
    if (!fullSentence) return;
    setIsSpeaking(true);
    speak(fullSentence, locale, () => setIsSpeaking(false));
  };

  return (
    <div
      className={[
        styles.bar,
        profile.highContrast ? styles.highContrast : "",
        isSpeaking ? styles.barSpeaking : "",
      ].join(" ")}
    >
      <div className={styles.words}>
        {sentence.map((tile) => (
          <span key={tile.id} className={styles.word}>
            {(tile.translations?.[locale] || tile.word) + " "}
          </span>
        ))}

        {sentence.length === 0 && (
          <span className={styles.hint}>{t("tapToSpeak")}</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button className={styles.speak} onClick={handleSpeak} disabled={!fullSentence}>
          🔊 {t("speak")}
        </button>

        <button
          className={styles.deleteLast}
          onClick={onDeleteLast}
          disabled={sentence.length === 0}
        >
          ⬅️ {t("deleteLast")}
        </button>

        <button className={styles.clear} onClick={onClear} disabled={sentence.length === 0}>
          ❌ {t("clear")}
        </button>
      </div>
    </div>
  );
}
