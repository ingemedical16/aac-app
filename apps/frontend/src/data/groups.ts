import type { Group } from "@/types/group";

export const GROUPS: Group[] = [
  { id: "mealBasics", translateKey: "group.mealBasics", categoryId: "food" },
  { id: "freshSnacks", translateKey: "group.freshSnacks", categoryId: "food" },

  { id: "everydayDrinks", translateKey: "group.everydayDrinks", categoryId: "drink" },
  { id: "treatDrinks", translateKey: "group.treatDrinks", categoryId: "drink" },
  { id: "hotDrinks", translateKey: "group.hotDrinks", categoryId: "drink" },

  { id: "basicHelp", translateKey: "group.basicHelp", categoryId: "help" },
  { id: "preference", translateKey: "group.preference", categoryId: "help" },

  { id: "positiveFeelings", translateKey: "group.positiveFeelings", categoryId: "feelings" },
  { id: "negativeFeelings", translateKey: "group.negativeFeelings", categoryId: "feelings" },
  { id: "energyFeelings", translateKey: "group.energyFeelings", categoryId: "feelings" },

  { id: "movementActions", translateKey: "group.movementActions", categoryId: "actions" },
  { id: "positionActions", translateKey: "group.positionActions", categoryId: "actions" },

  { id: "family", translateKey: "group.family", categoryId: "people" },
  { id: "schoolPeople", translateKey: "group.schoolPeople", categoryId: "people" },
];
