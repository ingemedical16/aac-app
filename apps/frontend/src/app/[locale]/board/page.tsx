"use client";

import { use, useMemo, useState } from "react";

import AppHeader from "@/components/AppHeader";
import MobileMenu from "@/components/MobileMenu";
import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";
import { useCurrentLanguage } from "@/hooks/useCurrentLanguage";

import { TILES_BY_CATEGORY } from "@/data/tiles";
import { CATEGORIES } from "@/data/categories";
import { GROUPS } from "@/data/groups";

import type { TileData } from "@/types/tile";
import type { Group } from "@/types/group";


export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
 

  const [activeCategory, setActiveCategory] = useState("food");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const lang = useCurrentLanguage();

  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  const groups = useMemo<Group[]>(() => {
    if (!tiles.length) return [];

    const usedGroupKeys = new Set(
      tiles.map((t) => t.groupKey).filter(Boolean) as string[]
    );

    return GROUPS.filter((g) => usedGroupKeys.has(g.translateKey)).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [tiles]);

  const filteredTiles = useMemo(() => {
    if (!activeGroup) return tiles;
    return tiles.filter((t) => t.groupKey === activeGroup.translateKey);
  }, [tiles, activeGroup]);

  return (
    <>
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={CATEGORIES}
        groups={groups}
        activeCategory={activeCategory}
        activeGroup={activeGroup?.id ?? null}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setActiveGroup(null);
          if (!groups.length) setMenuOpen(false);
        }}
        onSelectGroup={(groupId) => {
          const next =
            groupId === null
              ? null
              : groups.find((g) => g.id === groupId) ?? null;

          setActiveGroup(next);
          setMenuOpen(false);
        }}
      />

      <main style={{ padding: 20 }}>
        <CategoryBar
          key={`category-${activeCategory}`}
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={(catId) => {
            setActiveCategory(catId);
            setActiveGroup(null);
          }}
        />

        <SubcategoryBar
          key={`group-${lang}`}
          groups={groups}
          activeGroup={activeGroup?.id ?? null}
          onSelect={(groupId) => {
            const next =
              groupId === null
                ? null
                : groups.find((g) => g.id === groupId) ?? null;

            setActiveGroup(next);
          }}
        />

        <SentenceBar
          sentence={sentence}
          onClear={() => setSentence([])}
          onDeleteLast={() => setSentence((s) => s.slice(0, -1))}
        />

        <Board
          tiles={filteredTiles}
          onTileSelect={(tile) =>
            setSentence((prev) =>
              prev.some((t) => t.id === tile.id) ? prev : [...prev, tile]
            )
          }
        />
      </main>
    </>
  );
}