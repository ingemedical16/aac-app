import type { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: "food",
    translateKey: "category.food",
    icon: "🍞",
    order: 1,
  },
  {
    id: "drink",
    translateKey: "category.drink",
    icon: "🥤",
    order: 2,
  },
  {
    id: "help",
    translateKey: "category.help",
    icon: "🆘",
    order: 3,
  },
  {
    id: "feelings",
    translateKey: "category.feelings",
    icon: "😊",
    order: 4,
  },
  {
    id: "actions",
    translateKey: "category.actions",
    icon: "🏃",
    order: 5,
  },
  {
    id: "people",
    translateKey: "category.people",
    icon: "👨‍👩‍👧",
    order: 6,
  },
];
