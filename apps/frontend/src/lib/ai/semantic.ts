// src/lib/ai/semantic.ts

export const SEMANTIC = {
  WANT: "semantic.want",
  DONT_WANT: "semantic.dont_want",
  HELP: "semantic.help",
  STOP: "semantic.stop",

  MORE: "semantic.more",
  AGAIN: "semantic.again",
  VERY: "semantic.very",

  QUANTITY: {
    ONE: "semantic.quantity.one",
    TWO: "semantic.quantity.two",
    MANY: "semantic.quantity.many",
  },

  FEELING_HAPPY: "semantic.feeling.happy",
  FEELING_SAD: "semantic.feeling.sad",
  FEELING_ANGRY: "semantic.feeling.angry",
  FEELING_TIRED: "semantic.feeling.tired",

  ACTION_GO: "semantic.action.go",
  ACTION_COME: "semantic.action.come",
  ACTION_SIT: "semantic.action.sit",
  ACTION_STAND: "semantic.action.stand",
} as const;

/** ✅ union of ALL string literal values (including nested QUANTITY values) */
type ValueOf<T> = T[keyof T];
type NestedValueOf<T> = ValueOf<{
  [K in keyof T]: T[K] extends Record<string, any> ? ValueOf<T[K]> : T[K];
}>;

export type SemanticToken = NestedValueOf<typeof SEMANTIC>;

/* =========================
   HELPERS
========================= */

export function isQuantitySemantic(
  s?: SemanticToken
): s is ValueOf<typeof SEMANTIC.QUANTITY> {
  return typeof s === "string" && s.startsWith("semantic.quantity.");
}

export function isModifierSemantic(s?: SemanticToken): boolean {
  return (
    s === SEMANTIC.MORE ||
    s === SEMANTIC.AGAIN ||
    s === SEMANTIC.VERY
  );
}

export function isFeelingSemantic(s?: SemanticToken): boolean {
  return typeof s === "string" && s.startsWith("semantic.feeling.");
}

export function isActionSemantic(s?: SemanticToken): boolean {
  return typeof s === "string" && s.startsWith("semantic.action.");
}
