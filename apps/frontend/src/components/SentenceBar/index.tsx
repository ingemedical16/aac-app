"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SentenceBar.module.scss";

import useTTS from "@/hooks/useTTS";
import { buildSentence, type GrammarMode } from "@/lib/sentenceBuilder";
import { TileData } from "@/components/Tile";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";

interface Props {
  sentence: TileData[];
  locale: string;
  onClear: () => void;
  onDeleteLast: () => void;
  grammarMode?: GrammarMode;

  activeCategoryLabel?: string;
  activeGroupLabel?: string | null;
}

export default function SentenceBar({
  sentence,
  locale,
  onClear,
  onDeleteLast,
  grammarMode = "simple",
  activeCategoryLabel,
  activeGroupLabel,
}: Props) {
  const { speak } = useTTS();
  const { t } = useTranslation("common");
  const { profile } = useUserProfile();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wordsRef = useRef<HTMLDivElement | null>(null);

  const fullSentence = buildSentence(
    sentence,
    locale as any,
    grammarMode
  );

  /* ✅ AUTO-SCROLL TO END WHEN SENTENCE CHANGES */
  useEffect(() => {
    if (!wordsRef.current) return;
    wordsRef.current.scrollTo({
      left: wordsRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [sentence]);

  const handleSpeak = () => {
    if (!fullSentence) return;
    setIsSpeaking(true);
    speak(fullSentence, locale, () => setIsSpeaking(false));
  };

  return (
    <div
      className={[
        styles.wrapper,
        profile.highContrast ? styles.highContrast : "",
      ].join(" ")}
    >
      {/* BREADCRUMB (mobile) */}
      {(activeCategoryLabel || activeGroupLabel) && (
        <div className={styles.breadcrumb}>
          <span>{activeCategoryLabel}</span>
          {activeGroupLabel && (
            <>
              <span className={styles.sep}>›</span>
              <span>{activeGroupLabel}</span>
            </>
          )}
        </div>
      )}

      <div
        className={[
          styles.bar,
          isSpeaking ? styles.barSpeaking : "",
        ].join(" ")}
      >
        {/* ROW 1 — AUTO-SCROLLING SENTENCE */}
        <div ref={wordsRef} className={styles.words}>
          {sentence.map((tile) => (
            <span key={tile.id} className={styles.word}>
              {(tile.translations?.[locale] || tile.word) + " "}
            </span>
          ))}

          {sentence.length === 0 && (
            <span className={styles.hint}>{t("tapToSpeak")}</span>
          )}
        </div>

        {/* ROW 2 — ACTION BUTTONS */}
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
    </div>
  );
}
