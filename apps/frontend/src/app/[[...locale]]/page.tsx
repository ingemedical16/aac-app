"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
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

  const { t } = useTranslation("common");

  // -----------------------------------------
  // STATE
  // -----------------------------------------
  const [activeCategory, setActiveCategory] = useState<string>("food");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);

  // All tiles for current category
  const categoryTiles = useMemo(
    () => TILES_BY_CATEGORY[activeCategory] ?? [],
    [activeCategory]
  );

  // Semantic groups (computed "AI-style" from tile.group)
  const availableGroups = useMemo(
    () =>
      Array.from(
        new Set(
          categoryTiles
            .map((t) => t.group)
            .filter((g): g is string => !!g)
        )
      ),
    [categoryTiles]
  );

  // Filter tiles by activeGroup if exists
  const visibleTiles = useMemo(() => {
    if (activeGroup && availableGroups.includes(activeGroup)) {
      return categoryTiles.filter((t) => t.group === activeGroup);
    }
    return categoryTiles;
  }, [categoryTiles, activeGroup, availableGroups]);

  // -----------------------------------------
  // LANGUAGE SYNC
  // -----------------------------------------
  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  // Reset subcategory + sentence when category changes
  useEffect(() => {
    setActiveGroup(null);
    setSentence([]);
  }, [activeCategory]);

  // -----------------------------------------
  // HANDLERS
  // -----------------------------------------
  function handleTileClick(tile: TileData) {
    setSentence((prev) => [...prev, tile]);
  }

  function handleClear() {
    setSentence([]);
  }

  function handleDeleteLast() {
    setSentence((prev) => prev.slice(0, -1));
  }

  // -----------------------------------------

  return (
    <main>
      <div style={{ padding: 20 }}>
        <h1>{t("appTitle")}</h1>

        <LanguageSwitcher />

        {/* MAIN CATEGORIES */}
        <CategoryBar
          locale={locale}
          activeCategory={activeCategory}
          onSelect={(cat) => setActiveCategory(cat)}
        />

        {/* AUTO-GENERATED SUBCATEGORIES FROM TILE GROUPS */}
        <SubcategoryBar
          locale={locale}
          groups={availableGroups}
          activeGroup={activeGroup}
          onSelect={setActiveGroup}
        />

        {/* SENTENCE BUILDER BAR */}
        <SentenceBar
          sentence={sentence}
          locale={locale}
          onClear={handleClear}
          onDeleteLast={handleDeleteLast}
        />

        {/* AAC TILE GRID */}
        <Board
          tiles={visibleTiles}
          locale={locale}
          onTileSelect={handleTileClick}
        />
      </div>
    </main>
  );
}
