"use client";

import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import CategoryBar from "@/components/CategoryBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";
import { TILES_BY_CATEGORY } from "@/data/tiles";
import { TileData } from "@/components/Tile";

export default function LocalePage({ params }: { params: Promise<{ locale?: string[] }> }) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";

  const { t } = useTranslation("common");

  // STATE
  const [activeCategory, setActiveCategory] = useState("food");
  const [sentence, setSentence] = useState<TileData[]>([]);

  const tiles = TILES_BY_CATEGORY[activeCategory] || [];

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  // TILE SELECTION
  const handleTileSelect = (tile: TileData) => {
    setSentence((prev) => [...prev, tile]);
  };

  const handleClear = () => setSentence([]);
  const handleDeleteLast = () =>
    setSentence((prev) => prev.slice(0, -1));

  return (
    <main>
      <div style={{ padding: 20 }}>
        <h1>{t("appTitle")}</h1>

        <LanguageSwitcher />

        <CategoryBar
          locale={locale}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <SentenceBar
          sentence={sentence}
          locale={locale}
          onClear={handleClear}
          onDeleteLast={handleDeleteLast}
        />

        <Board
          tiles={tiles}
          locale={locale}
          onTileSelect={handleTileSelect}
        />
      </div>
    </main>
  );
}
