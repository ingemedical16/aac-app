"use client";

import { use, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import MobileMenu from "@/components/MobileMenu";
import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import Board from "@/components/Board";
import SentenceBar from "@/components/SentenceBar";
import { TILES_BY_CATEGORY } from "@/data/tiles";
import { TileData } from "@/components/Tile";
import { CATEGORIES } from "@/components/CategoryBar/categories";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = (resolved.locale?.[0] ?? "en") as "en" | "fr" | "ar" | "ro";

  const { t } = useTranslation("common");

  const [activeCategory, setActiveCategory] = useState("food");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  const groups = useMemo(() => {
    const set = new Set<string>();
    tiles.forEach((t) => t.group && set.add(t.group));
    return Array.from(set);
  }, [tiles]);

  const filteredTiles = useMemo(() => {
    if (!activeGroup) return tiles;
    return tiles.filter((t) => t.group === activeGroup);
  }, [tiles, activeGroup]);

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
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveGroup(null);
          if (groups.length === 0) setMenuOpen(false);
        }}
        onSelectGroup={(g) => {
          setActiveGroup(g);
          setMenuOpen(false);
        }}
      />

      <main style={{ padding: 20 }}>
        {/* DESKTOP / TABLET ONLY (hidden on mobile via CSS) */}
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
    </>
  );
}
