'use client';
import CategoryBar from "@/components/CategoryBar";
import { use, useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Board from "@/components/Board";
import { TileData } from "@/components/Tile";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { TILES_BY_CATEGORY } from "@/data/tiles";

export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";
  // TEMP demo tiles (will be replaced with backend API)
  
  const [activeCategory, setActiveCategory] = useState("food");
  const tiles = TILES_BY_CATEGORY[activeCategory] ?? [];

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  const { t } = useTranslation("common");

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
      <Board tiles={tiles} locale={locale} />
    
    </div>
    </main>
  );
}
