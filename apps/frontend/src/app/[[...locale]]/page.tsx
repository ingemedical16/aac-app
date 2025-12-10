'use client';

import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import CategoryBar from "@/components/CategoryBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";
import { TILES_BY_CATEGORY } from "@/data/tiles";
import { TileData } from "@/components/Tile";

export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";

  // -----------------------------------------
  // STATE
  // -----------------------------------------
  const [activeCategory, setActiveCategory] = useState("food");
  const [sentence, setSentence] = useState<TileData[]>([]);

  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  // -----------------------------------------
  // LANGUAGE SYNC
  // -----------------------------------------
  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  const { t } = useTranslation("common");

  // -----------------------------------------
  // HANDLERS
  // -----------------------------------------
  function handleTileClick(tile: TileData) {
    setSentence((prev) => [...prev, tile]);
  }
  function handleDeleteLast() {
  setSentence(prev => prev.slice(0, -1));
}


  function handleClear() {
    setSentence([]);
  }

  // -----------------------------------------

  return (
    <main>
      <div style={{ padding: 20 }}>
        <h1>{t("appTitle")}</h1>

        <LanguageSwitcher />

        <CategoryBar
          locale={locale}
          activeCategory={activeCategory}
          onSelect={(cat) => setActiveCategory(cat)}
        />

        {/* 🟦 Sentence Builder Bar */}
        <SentenceBar
          sentence={sentence}
          locale={locale}
          onClear={handleClear}
          onDeleteLast={handleDeleteLast}
        />

        {/* 🟩 AAC Tile Grid */}
        <Board
          tiles={tiles}
          locale={locale}
          onTileSelect={handleTileClick}
        />
      </div>
    </main>
  );
}
