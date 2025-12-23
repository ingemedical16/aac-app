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

  const fullSentence = buildSentence(sentence, locale as any, grammarMode);

  // ✅ Auto-scroll (RTL-safe)
  useEffect(() => {
    if (!wordsRef.current) return;

    const dir =
      typeof document !== "undefined"
        ? document.documentElement.getAttribute("dir")
        : "ltr";

    const el = wordsRef.current;

    // LTR → scroll to far right. RTL → scroll to far left.
    const left = dir === "rtl" ? 0 : el.scrollWidth;

    el.scrollTo({ left, behavior: "smooth" });
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
        profile.settings.highContrast ? styles.highContrast : "",
      ].join(" ")}
    >
      {(activeCategoryLabel || activeGroupLabel) && (
        <div className={styles.breadcrumb} aria-label={t("breadcrumb")}>
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
        className={[styles.bar, isSpeaking ? styles.barSpeaking : ""].join(" ")}
      >
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
