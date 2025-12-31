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

  const groups = useMemo(() => {
    const set = new Set<string>();
    tiles.forEach((t) => t.groupKey && set.add(t.groupKey));
    return Array.from(set);
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

      {/* MOBILE MENU (single source of truth on mobile) */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        categories={CATEGORIES}
        groups={groups}
        activeCategory={activeCategory}
        activeGroup={activeGroup}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setActiveGroup(null);
          if (groups.length === 0) setMenuOpen(false);
        }}
        onSelectGroup={(groupKey) => {
          setActiveGroup(groupKey);
          setMenuOpen(false);
        }}
      />

      <main style={{ padding: 20 }}>
        {/* DESKTOP / TABLET ONLY */}
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
          activeGroup={activeGroup}
          onSelect={setActiveGroup}
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
