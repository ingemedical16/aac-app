'use client';

import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Board from "@/components/Board";
import { TileData } from "@/components/Tile";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LocalePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>;
}) {
  const resolved = use(params);
  const locale = resolved.locale?.[0] ?? "en";
  // TEMP demo tiles (will be replaced with backend API)
  const demoTiles: TileData[] = [
    {
      id: 1,
      word: "Eat",
      translations: { fr: "Manger", ar: "أكل" },
      imageUrl: "/eat.png",
      lang: "en-US",
      category: "food",
      order: 1
    },
    {
      id: 2,
      word: "Drink",
      translations: { fr: "Boire", ar: "اشرب" },
      imageUrl: "/drink.png",
      lang: "en-US",
      category: "food",
      order: 2
    }
  ];

  useEffect(() => {
    i18next.changeLanguage(locale);
  }, [locale]);

  const { t } = useTranslation("common");

  return (
    <main>
    <div style={{ padding: 20 }}>
      <h1>{t("appTitle")}</h1>
      <LanguageSwitcher />
      
      <Board tiles={demoTiles} locale={locale} />
    
    </div>
    </main>
  );
}
