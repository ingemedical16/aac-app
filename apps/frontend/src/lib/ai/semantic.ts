// src/lib/ai/semantic.ts

/**
 * Semantic tokens are language-independent meanings
 * attached to tiles. They are consumed by:
 * - sentenceBuilder
 * - AI rule engine
 * - grammar logic
 *
 * NEVER localised.
 * NEVER numeric.
 */

export const SEMANTIC = {
  /** repetition / continuation */
  MORE: "semantic.more",
  AGAIN: "semantic.again",

  /** intensity */
  VERY: "semantic.very",

  /** quantity modifiers */
  QUANTITY: {
    ONE: "semantic.quantity.one",
    TWO: "semantic.quantity.two",
    MANY: "semantic.quantity.many",
  },
} as const;

/**
 * Union of all semantic tokens
 */
export type SemanticToken =
  | typeof SEMANTIC.MORE
  | typeof SEMANTIC.AGAIN
  | typeof SEMANTIC.VERY
  | (typeof SEMANTIC.QUANTITY)[keyof typeof SEMANTIC.QUANTITY];

/**
 * Narrow helpers (OPTIONAL but recommended)
 */
export function isQuantitySemantic(
  s?: SemanticToken
): s is (typeof SEMANTIC.QUANTITY)[keyof typeof SEMANTIC.QUANTITY] {
  return !!s && s.startsWith("semantic.quantity.");
}

export function isModifierSemantic(s?: SemanticToken): boolean {
  return (
    s === SEMANTIC.MORE ||
    s === SEMANTIC.AGAIN ||
    s === SEMANTIC.VERY
  );
}
