export interface Category {
  /** Stable logical id (used in state & DB) */
  id: string;                 // "food"

  /** i18n key */
  translateKey: string;       // "category.food"

  /** UI icon (emoji now, pictogram later) */
  icon: string;               // "🍞"

  /** Optional ordering */
  order?: number;
}
