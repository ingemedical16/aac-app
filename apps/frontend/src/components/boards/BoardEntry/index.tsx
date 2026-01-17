"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./BoardEntry.module.scss";




/* UI */

import CategoryBar from "@/components/CategoryBar";
import SubcategoryBar from "@/components/SubcategoryBar";
import SentenceBar from "@/components/SentenceBar";
import BoardContainer from "@/components/BoardContainer";

/* Data */
import { CATEGORIES } from "@/data/categories";
import { GROUPS } from "@/data/groups";
import { TILES_BY_CATEGORY } from "@/data/tiles";

/* Types */
import type { TileData } from "@/types/tile";
import type { Group } from "@/types/group";
import { tx } from "@/lib/i18n/tx";

export default function BoardEntry() {
  const { t } = useTranslation();

  /* =========================
     BOARD STATE
  ========================= */
  const [activeCategory, setActiveCategory] = useState<string>("food");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [sentence, setSentence] = useState<TileData[]>([]);


  /* =========================
     DATA
  ========================= */
  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  const groups = useMemo<Group[]>(() => {
    if (!tiles.length) return [];

    const used = new Set(
      tiles.map((t) => t.groupKey).filter(Boolean) as string[]
    );

    return GROUPS.filter((g) => used.has(g.translateKey)).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
  }, [tiles]);

  const filteredTiles = useMemo(() => {
    if (!activeGroup) return tiles;
    return tiles.filter(
      (t) => t.groupKey === activeGroup.translateKey
    );
  }, [tiles, activeGroup]);

 
  /* =========================
     RENDER
  ========================= */
  return (
    <section className={styles.wrapper}>

      <main className={styles.main}>
        {/* Screen-reader only title */}
        <h1 className="sr-only">
          {t(tx("common", "boardTitle"))}
        </h1>

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

        <BoardContainer
          tiles={filteredTiles}
          onTileSelect={(tile) =>
            setSentence((prev) =>
              prev.some((t) => t.id === tile.id)
                ? prev
                : [...prev, tile]
            )
          }
        />
      </main>
    </section>
  );
}