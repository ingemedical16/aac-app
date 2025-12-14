"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
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

  const [activeCategory, setActiveCategory] = useState("food");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  const groups = useMemo(() => {
    const set = new Set<string>();
    for (const tile of tiles) if (tile.group) set.add(tile.group);
    return Array.from(set);
  }, [tiles]);

  const filteredTiles = useMemo(() => {
    if (!activeGroup) return tiles;
    return tiles.filter((t) => t.group === activeGroup);
  }, [tiles, activeGroup]);

  return (
    <main style={{ padding: 20 }}>
      {/* The visible title is now small and belongs to the header */}
      <CategoryBar
        locale={locale}
        activeCategory={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setActiveGroup(null);
        }}
      />

      <SubcategoryBar
        locale={locale}
        groups={groups}
        activeGroup={activeGroup}
        onSelect={setActiveGroup}
      />

      <SentenceBar
        sentence={sentence}
        locale={locale}
        onClear={() => setSentence([])}
        onDeleteLast={() => setSentence((s) => s.slice(0, -1))}
      />

      <Board
        tiles={filteredTiles}
        locale={locale}
        onTileSelect={(tile) => setSentence((prev) => [...prev, tile])}
      />
    </main>
  );
}
