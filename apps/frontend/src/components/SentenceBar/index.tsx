"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SentenceBar.module.scss";

import useTTS from "@/hooks/useTTS";
import { buildSentence, type GrammarMode } from "@/lib/sentenceBuilder";
import type { TileData } from "@/types/tile";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTranslation } from "react-i18next";
import { tx } from "@/lib/i18n/tx";

interface SentenceBarProps {
  sentence: TileData[];
  onClear: () => void;
  onDeleteLast: () => void;
  grammarMode?: GrammarMode;
}

export default function SentenceBar({
  sentence,
  onClear,
  onDeleteLast,
  grammarMode = "simple",
}: SentenceBarProps) {
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();
  console.log("i18n.language:", i18n.language);
  const { profile } = useUserProfile();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wordsRef = useRef<HTMLDivElement | null>(null);

  const fullSentence = buildSentence(
    sentence,
    i18n.language as any,
    grammarMode
  );

  /* =========================
     Auto-scroll (RTL safe)
  ========================= */
  useEffect(() => {
    if (!wordsRef.current) return;

    const dir = document.documentElement.getAttribute("dir") ?? "ltr";
    const el = wordsRef.current;

    el.scrollTo({
      left: dir === "rtl" ? 0 : el.scrollWidth,
      behavior: "smooth",
    });
  }, [sentence]);

  const handleSpeak = () => {
    if (!fullSentence) return;
    setIsSpeaking(true);
    speak(fullSentence, () => setIsSpeaking(false));
  };

  return (
    <div
      className={[
        styles.wrapper,
        profile.highContrast ? styles.highContrast : "",
      ].join(" ")}
    >
      <div
        className={[styles.bar, isSpeaking ? styles.barSpeaking : ""].join(" ")}
      >
        <div ref={wordsRef} className={styles.words}>
          {sentence.map((tile) => (
            <span key={tile.id} className={styles.word}>
              {t(tx("tiles", tile.translateKey))}{" "}
            </span>
          ))}

          {sentence.length === 0 && (
            <span className={styles.hint}>{t("tapToSpeak")}</span>
          )}
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.speak}
            onClick={handleSpeak}
            disabled={!fullSentence}
            aria-label={t("speak")}
          >
            🔊 {t("speak")}
          </button>

          <button
            type="button"
            className={styles.deleteLast}
            onClick={onDeleteLast}
            disabled={sentence.length === 0}
            aria-label={t("deleteLast")}
          >
            ⬅️ {t("deleteLast")}
          </button>

          <button
            type="button"
            className={styles.clear}
            onClick={onClear}
            disabled={sentence.length === 0}
            aria-label={t("clear")}
          >
            ❌ {t("clear")}
          </button>
        </div>
      </div>
    </div>
  );
}
