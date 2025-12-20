export interface Category {
  id: string;
  label: {
    en: string;
    fr: string;
    ar: string;
    ro: string;
  };
  icon: string; // emoji now → pictograms later
}

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: {
      en: "Food",
      fr: "Nourriture",
      ar: "طعام",
      ro: "Mâncare",
    },
    icon: "🍽️",
  },
  {
    id: "drink",
    label: {
      en: "Drink",
      fr: "Boire",
      ar: "مشروبات",
      ro: "Băuturi",
    },
    icon: "🥤",
  },
  {
    id: "more",
    label: {
      en: "More",
      fr: "Plus",
      ar: "المزيد",
      ro: "Mai mult",
    },
    icon: "➕",
  },
  {
    id: "help",
    label: {
      en: "Help",
      fr: "Aide",
      ar: "مساعدة",
      ro: "Ajutor",
    },
    icon: "🆘",
  },
  {
    id: "feelings",
    label: {
      en: "Feelings",
      fr: "Émotions",
      ar: "المشاعر",
      ro: "Sentimente",
    },
    icon: "😊",
  },
  {
    id: "actions",
    label: {
      en: "Actions",
      fr: "Actions",
      ar: "أفعال",
      ro: "Acțiuni",
    },
    icon: "🏃",
  },
  {
    id: "people",
    label: {
      en: "People",
      fr: "Personnes",
      ar: "أشخاص",
      ro: "Persoane",
    },
    icon: "👨‍👩‍👧",
  },
];
