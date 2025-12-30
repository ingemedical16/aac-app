// src/data/tiles.ts
import { TileData } from "@/types/tile";
import { SEMANTIC } from "@/lib/ai/semantic";

export const TILES_BY_CATEGORY: Record<string, TileData[]> = {
  food: [
    {
      id: "food-bread",
      translateKey: "tile.food.bread",
      categoryKey: "category.food",
      groupKey: "group.mealBasics",
      imageUrl: "/images/bread.png",
      order: 1,
    },
    {
      id: "food-fruit",
      translateKey: "tile.food.fruit",
      categoryKey: "category.food",
      groupKey: "group.freshSnacks",
      imageUrl: "/images/fruit.png",
      order: 2,
    },
  ],

  more: [
    {
      id: "more-more",
      translateKey: "tile.more.more",
      categoryKey: "category.more",
      groupKey: "group.quantityControl",
      semantic: SEMANTIC.MORE,
      imageUrl: "/images/more.png",
    },
    {
      id: "more-again",
      translateKey: "tile.more.again",
      categoryKey: "category.more",
      groupKey: "group.quantityControl",
      semantic: SEMANTIC.AGAIN,
      imageUrl: "/images/again.png",
    },
  ],
};
