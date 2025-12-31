// src/data/tiles.ts
import type { TileData } from "@/types/tile";
import { SEMANTIC } from "@/lib/ai/semantic";

export const TILES_BY_CATEGORY: Record<string, TileData[]> = {
  /* ===============================
     FOOD (nouns → NO semantic)
  =============================== */
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
    {
      id: "food-yogurt",
      translateKey: "tile.food.yogurt",
      categoryKey: "category.food",
      groupKey: "group.freshSnacks",
      imageUrl: "/images/yogurt.png",
      order: 3,
    },
    {
      id: "food-rice",
      translateKey: "tile.food.rice",
      categoryKey: "category.food",
      groupKey: "group.mealBasics",
      imageUrl: "/images/rice.png",
      order: 4,
    },
    {
      id: "food-egg",
      translateKey: "tile.food.egg",
      categoryKey: "category.food",
      groupKey: "group.mealBasics",
      imageUrl: "/images/egg.png",
      order: 5,
    },
    {
      id: "food-soup",
      translateKey: "tile.food.soup",
      categoryKey: "category.food",
      groupKey: "group.mealBasics",
      imageUrl: "/images/soup.png",
      order: 6,
    },
  ],

  /* ===============================
     DRINK (nouns → NO semantic)
  =============================== */
  drink: [
    {
      id: "drink-water",
      translateKey: "tile.drink.water",
      categoryKey: "category.drink",
      groupKey: "group.everydayDrinks",
      imageUrl: "/images/water.png",
      order: 1,
    },
    {
      id: "drink-juice",
      translateKey: "tile.drink.juice",
      categoryKey: "category.drink",
      groupKey: "group.treatDrinks",
      imageUrl: "/images/juice.png",
      order: 2,
    },
    {
      id: "drink-milk",
      translateKey: "tile.drink.milk",
      categoryKey: "category.drink",
      groupKey: "group.everydayDrinks",
      imageUrl: "/images/milk.png",
      order: 3,
    },
    {
      id: "drink-tea",
      translateKey: "tile.drink.tea",
      categoryKey: "category.drink",
      groupKey: "group.hotDrinks",
      imageUrl: "/images/tea.png",
      order: 4,
    },
    {
      id: "drink-soda",
      translateKey: "tile.drink.soda",
      categoryKey: "category.drink",
      groupKey: "group.treatDrinks",
      imageUrl: "/images/soda.png",
      order: 5,
    },
  ],

  /* ===============================
     MORE / QUANTITY (semantic)
  =============================== */
  more: [
    {
      id: "more-more",
      translateKey: "tile.more.more",
      categoryKey: "category.more",
      groupKey: "group.quantityControl",
      semantic: SEMANTIC.MORE,
      imageUrl: "/images/more.png",
      order: 1,
    },
    {
      id: "more-again",
      translateKey: "tile.more.again",
      categoryKey: "category.more",
      groupKey: "group.quantityControl",
      semantic: SEMANTIC.AGAIN,
      imageUrl: "/images/again.png",
      order: 2,
    },
  ],

  /* ===============================
     HELP / PREFERENCES (semantic)
  =============================== */
  help: [
    {
      id: "help-help",
      translateKey: "tile.help.help",
      categoryKey: "category.help",
      groupKey: "group.basicHelp",
      semantic: SEMANTIC.HELP,
      imageUrl: "/images/help.png",
      order: 1,
    },
    {
      id: "help-stop",
      translateKey: "tile.help.stop",
      categoryKey: "category.help",
      groupKey: "group.basicHelp",
      semantic: SEMANTIC.STOP,
      imageUrl: "/images/stop.png",
      order: 2,
    },
    {
      id: "help-want",
      translateKey: "tile.help.want",
      categoryKey: "category.help",
      groupKey: "group.preference",
      semantic: SEMANTIC.WANT,
      imageUrl: "/images/want.png",
      order: 3,
    },
    {
      id: "help-dontwant",
      translateKey: "tile.help.dontWant",
      categoryKey: "category.help",
      groupKey: "group.preference",
      semantic: SEMANTIC.DONT_WANT,
      imageUrl: "/images/dontwant.png",
      order: 4,
    },
  ],

  /* ===============================
     FEELINGS (semantic)
  =============================== */
  feelings: [
    {
      id: "feelings-happy",
      translateKey: "tile.feelings.happy",
      categoryKey: "category.feelings",
      groupKey: "group.positiveFeelings",
      semantic: SEMANTIC.FEELING_HAPPY,
      imageUrl: "/images/happy.png",
      order: 1,
    },
    {
      id: "feelings-sad",
      translateKey: "tile.feelings.sad",
      categoryKey: "category.feelings",
      groupKey: "group.negativeFeelings",
      semantic: SEMANTIC.FEELING_SAD,
      imageUrl: "/images/sad.png",
      order: 2,
    },
    {
      id: "feelings-angry",
      translateKey: "tile.feelings.angry",
      categoryKey: "category.feelings",
      groupKey: "group.negativeFeelings",
      semantic: SEMANTIC.FEELING_ANGRY,
      imageUrl: "/images/angry.png",
      order: 3,
    },
    {
      id: "feelings-tired",
      translateKey: "tile.feelings.tired",
      categoryKey: "category.feelings",
      groupKey: "group.energyFeelings",
      semantic: SEMANTIC.FEELING_TIRED,
      imageUrl: "/images/tired.png",
      order: 4,
    },
  ],

  /* ===============================
     ACTIONS (semantic)
  =============================== */
  actions: [
    {
      id: "actions-go",
      translateKey: "tile.actions.go",
      categoryKey: "category.actions",
      groupKey: "group.movementActions",
      semantic: SEMANTIC.ACTION_GO,
      imageUrl: "/images/go.png",
      order: 1,
    },
    {
      id: "actions-come",
      translateKey: "tile.actions.come",
      categoryKey: "category.actions",
      groupKey: "group.movementActions",
      semantic: SEMANTIC.ACTION_COME,
      imageUrl: "/images/come.png",
      order: 2,
    },
    {
      id: "actions-sit",
      translateKey: "tile.actions.sit",
      categoryKey: "category.actions",
      groupKey: "group.positionActions",
      semantic: SEMANTIC.ACTION_SIT,
      imageUrl: "/images/sit.png",
      order: 3,
    },
    {
      id: "actions-stand",
      translateKey: "tile.actions.stand",
      categoryKey: "category.actions",
      groupKey: "group.positionActions",
      semantic: SEMANTIC.ACTION_STAND,
      imageUrl: "/images/stand.png",
      order: 4,
    },
  ],

  /* ===============================
     PEOPLE (nouns → NO semantic)
  =============================== */
  people: [
    {
      id: "people-mom",
      translateKey: "tile.people.mom",
      categoryKey: "category.people",
      groupKey: "group.family",
      imageUrl: "/images/mom.png",
      order: 1,
    },
    {
      id: "people-dad",
      translateKey: "tile.people.dad",
      categoryKey: "category.people",
      groupKey: "group.family",
      imageUrl: "/images/dad.png",
      order: 2,
    },
    {
      id: "people-teacher",
      translateKey: "tile.people.teacher",
      categoryKey: "category.people",
      groupKey: "group.schoolPeople",
      imageUrl: "/images/teacher.png",
      order: 3,
    },
    {
      id: "people-friend",
      translateKey: "tile.people.friend",
      categoryKey: "category.people",
      groupKey: "group.schoolPeople",
      imageUrl: "/images/friend.png",
      order: 4,
    },
  ],
};