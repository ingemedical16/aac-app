import { TileData } from "@/components/Tile";

export const TILES_BY_CATEGORY: Record<string, TileData[]> = {
  // ===============================
  // FOOD
  // ===============================
  food: [
    {
      id: 1,
      word: "Bread",
      translations: { fr: "Pain", ar: "خبز", ro: "Pâine" },
      imageUrl: "/images/bread.png",
      lang: "en-US",
      category: "food",
      order: 1,
      group: "mealBasics", // 🍞 staple food
    },
    {
      id: 2,
      word: "Fruit",
      translations: { fr: "Fruit", ar: "فاكهة", ro: "Fruct" },
      imageUrl: "/images/fruit.png",
      lang: "en-US",
      category: "food",
      order: 2,
      group: "freshSnacks", // 🍎 fresh / snack
    },
    {
      id: 3,
      word: "Yogurt",
      translations: { fr: "Yaourt", ar: "لبن", ro: "Iaurt" },
      imageUrl: "/images/yogurt.png",
      lang: "en-US",
      category: "food",
      order: 3,
      group: "freshSnacks",
    },
    {
      id: 4,
      word: "Rice",
      translations: { fr: "Riz", ar: "أرز", ro: "Orez" },
      imageUrl: "/images/rice.png",
      lang: "en-US",
      category: "food",
      order: 4,
      group: "mealBasics",
    },
    {
      id: 5,
      word: "Egg",
      translations: { fr: "Œuf", ar: "بيضة", ro: "Ou" },
      imageUrl: "/images/egg.png",
      lang: "en-US",
      category: "food",
      order: 5,
      group: "mealBasics",
    },
    {
      id: 6,
      word: "Soup",
      translations: { fr: "Soupe", ar: "حساء", ro: "Supă" },
      imageUrl: "/images/soup.png",
      lang: "en-US",
      category: "food",
      order: 6,
      group: "mealBasics",
    },
  ],

  // ===============================
  // DRINK
  // ===============================
  drink: [
    {
      id: 10,
      word: "Water",
      translations: { fr: "Eau", ar: "ماء", ro: "Apă" },
      imageUrl: "/images/water.png",
      lang: "en-US",
      category: "drink",
      order: 1,
      group: "everydayDrinks", // 💧 everyday drink
    },
    {
      id: 11,
      word: "Juice",
      translations: { fr: "Jus", ar: "عصير", ro: "Suc" },
      imageUrl: "/images/juice.png",
      lang: "en-US",
      category: "drink",
      order: 2,
      group: "treatDrinks", // 🧃 treat
    },
    {
      id: 12,
      word: "Milk",
      translations: { fr: "Lait", ar: "حليب", ro: "Lapte" },
      imageUrl: "/images/milk.png",
      lang: "en-US",
      category: "drink",
      order: 3,
      group: "everydayDrinks",
    },
    {
      id: 13,
      word: "Tea",
      translations: { fr: "Thé", ar: "شاي", ro: "Ceai" },
      imageUrl: "/images/tea.png",
      lang: "en-US",
      category: "drink",
      order: 4,
      group: "hotDrinks", // ☕ hot drinks
    },
    {
      id: 14,
      word: "Soda",
      translations: { fr: "Soda", ar: "مشروب غازي", ro: "Suc carbogazos" },
      imageUrl: "/images/soda.png",
      lang: "en-US",
      category: "drink",
      order: 5,
      group: "treatDrinks",
    },
  ],

  // ===============================
  // MORE
  // ===============================
  more: [
    {
      id: 30,
      word: "More",
      translations: { fr: "Encore", ar: "المزيد", ro: "Mai mult" },
      imageUrl: "/images/more.png",
      lang: "en-US",
      category: "more",
      order: 1,
      group: "quantityControl",
    },
    {
      id: 31,
      word: "Again",
      translations: { fr: "Encore", ar: "مرة أخرى", ro: "Încă o dată" },
      imageUrl: "/images/again.png",
      lang: "en-US",
      category: "more",
      order: 2,
      group: "quantityControl",
    },
  ],

  // ===============================
  // HELP
  // ===============================
  help: [
    {
      id: 20,
      word: "Help",
      translations: { fr: "Aide", ar: "مساعدة", ro: "Ajutor" },
      imageUrl: "/images/help.png",
      lang: "en-US",
      category: "help",
      order: 1,
      group: "basicHelp",
    },
    {
      id: 21,
      word: "Stop",
      translations: { fr: "Arrête", ar: "توقف", ro: "Stop" },
      imageUrl: "/images/stop.png",
      lang: "en-US",
      category: "help",
      order: 2,
      group: "basicHelp",
    },
    {
      id: 22,
      word: "I want",
      translations: { fr: "Je veux", ar: "أريد", ro: "Vreau" },
      imageUrl: "/images/want.png",
      lang: "en-US",
      category: "help",
      order: 3,
      group: "preference",
    },
    {
      id: 23,
      word: "Don't want",
      translations: { fr: "Je ne veux pas", ar: "لا أريد", ro: "Nu vreau" },
      imageUrl: "/images/dontwant.png",
      lang: "en-US",
      category: "help",
      order: 4,
      group: "preference",
    },
  ],

  // ===============================
  // FEELINGS
  // ===============================
  feelings: [
    {
      id: 40,
      word: "Happy",
      translations: { fr: "Content", ar: "سعيد", ro: "Fericit" },
      imageUrl: "/images/happy.png",
      lang: "en-US",
      category: "feelings",
      order: 1,
      group: "positiveFeelings",
    },
    {
      id: 41,
      word: "Sad",
      translations: { fr: "Triste", ar: "حزين", ro: "Trist" },
      imageUrl: "/images/sad.png",
      lang: "en-US",
      category: "feelings",
      order: 2,
      group: "negativeFeelings",
    },
    {
      id: 42,
      word: "Angry",
      translations: { fr: "En colère", ar: "غاضب", ro: "Furios" },
      imageUrl: "/images/angry.png",
      lang: "en-US",
      category: "feelings",
      order: 3,
      group: "negativeFeelings",
    },
    {
      id: 43,
      word: "Tired",
      translations: { fr: "Fatigué", ar: "متعب", ro: "Obosit" },
      imageUrl: "/images/tired.png",
      lang: "en-US",
      category: "feelings",
      order: 4,
      group: "energyFeelings",
    },
  ],

  // ===============================
  // ACTIONS
  // ===============================
  actions: [
    {
      id: 50,
      word: "Go",
      translations: { fr: "Aller", ar: "اذهب", ro: "Mergi" },
      imageUrl: "/images/go.png",
      lang: "en-US",
      category: "actions",
      order: 1,
      group: "movementActions",
    },
    {
      id: 51,
      word: "Come",
      translations: { fr: "Viens", ar: "تعال", ro: "Vino" },
      imageUrl: "/images/come.png",
      lang: "en-US",
      category: "actions",
      order: 2,
      group: "movementActions",
    },
    {
      id: 52,
      word: "Sit",
      translations: { fr: "Assis", ar: "اجلس", ro: "Stai jos" },
      imageUrl: "/images/sit.png",
      lang: "en-US",
      category: "actions",
      order: 3,
      group: "positionActions",
    },
    {
      id: 53,
      word: "Stand",
      translations: { fr: "Debout", ar: "قف", ro: "Ridică-te" },
      imageUrl: "/images/stand.png",
      lang: "en-US",
      category: "actions",
      order: 4,
      group: "positionActions",
    },
  ],

  // ===============================
  // PEOPLE
  // ===============================
  people: [
    {
      id: 60,
      word: "Mom",
      translations: { fr: "Maman", ar: "أمي", ro: "Mama" },
      imageUrl: "/images/mom.png",
      lang: "en-US",
      category: "people",
      order: 1,
      group: "family",
    },
    {
      id: 61,
      word: "Dad",
      translations: { fr: "Papa", ar: "أبي", ro: "Tata" },
      imageUrl: "/images/dad.png",
      lang: "en-US",
      category: "people",
      order: 2,
      group: "family",
    },
    {
      id: 62,
      word: "Teacher",
      translations: { fr: "Professeur", ar: "معلمة", ro: "Profesor" },
      imageUrl: "/images/teacher.png",
      lang: "en-US",
      category: "people",
      order: 3,
      group: "schoolPeople",
    },
    {
      id: 63,
      word: "Friend",
      translations: { fr: "Ami", ar: "صديق", ro: "Prieteni" },
      imageUrl: "/images/friend.png",
      lang: "en-US",
      category: "people",
      order: 4,
      group: "schoolPeople",
    },
  ],
};
