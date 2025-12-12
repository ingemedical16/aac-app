"use client";

import { use, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";
import { TILES_BY_CATEGORY } from "@/data/tiles";
import { TileData } from "@/components/Tile";

export default function LocalePage({ params }: any) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";

  const { t } = useTranslation("common");

  const [activeCategory, setActiveCategory] = useState("food");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);

  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  // ✅ UNIQUE GROUPS FOR SUBCATEGORY BAR
  const groups = Array.from(
    new Set(
      tiles
        .map((t) => t.group)
        .filter(Boolean)
    )
  ) as string[];

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  return (
    <main style={{ padding: 16 }}>
      <h1>{t("appTitle")}</h1>

      <CategoryBar
        locale={locale}
        activeCategory={activeCategory}
        onSelect={(cat) => {
          setActiveCategory(cat);
          setActiveGroup(null); // reset group on category change
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
        tiles={
          activeGroup
            ? tiles.filter((t) => t.group === activeGroup)
            : tiles
        }
        locale={locale}
        onTileSelect={(tile) =>
          setSentence((prev) => [...prev, tile])
        }
      />
    </main>
  );
}
