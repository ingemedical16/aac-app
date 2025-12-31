"use client";

import { use, useEffect, useMemo, useState } from "react";
import i18next from "i18next";

import AppHeader from "@/components/AppHeader";
import MobileMenu from "@/components/MobileMenu";
import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";

import { TILES_BY_CATEGORY } from "@/data/tiles";
import { CATEGORIES } from "@/data/categories";
import { GROUPS } from "@/data/groups";

import type { TileData } from "@/types/tile";
import type { Group } from "@/types/group";
import type { LocaleCode } from "@/types/userProfile";

export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = (resolved.locale?.[0] ?? "en") as LocaleCode;

  /* =========================
     STATE
  ========================= */
  const [activeCategory, setActiveCategory] = useState<string>("food");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================
     i18n sync
  ========================= */
  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  /* =========================
     TILES
  ========================= */
  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  /**
   * ✅ Groups must come from GROUPS (domain source of truth),
   * not from raw string arrays built from tiles.
   */
  const groups = useMemo<Group[]>(() => {
    if (!tiles.length) return [];

    // groupKey stored on tiles: e.g. "group.mealBasics"
    const usedGroupKeys = new Set(
      tiles.map((t) => t.groupKey).filter(Boolean) as string[]
    );

    // Keep only groups used by current category tiles, sorted by order
    return GROUPS.filter((g) => usedGroupKeys.has(g.translateKey)).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [tiles]);

  const filteredTiles = useMemo(() => {
    if (!activeGroup) return tiles;
    return tiles.filter((t) => t.groupKey === activeGroup.translateKey);
  }, [tiles, activeGroup]);

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />

      {/* MOBILE MENU */}
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
          if (groups.length === 0) setMenuOpen(false);
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
        {/* DESKTOP / TABLET */}
        <CategoryBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={(catId) => {
            setActiveCategory(catId);
            setActiveGroup(null);
          }}
        />

        <SubcategoryBar
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
