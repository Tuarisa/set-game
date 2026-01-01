import type { Card, Difficulty } from './types';

type AttributeKey = 'color' | 'shape' | 'fill' | 'count';
const ATTRIBUTES: AttributeKey[] = ['color', 'shape', 'fill', 'count'];

/**
 * Check if a single attribute forms a valid set pattern
 * (all same or all different across 4 cards)
 */
function isValidAttribute<T>(values: T[]): boolean {
  const unique = new Set(values);
  // For 4 cards: all same (1 unique) or all different (4 unique)
  return unique.size === 1 || unique.size === 4;
}

/**
 * Count how many attributes have all-same values
 */
export function countSameAttributes(cards: Card[]): number {
  let count = 0;
  for (const attr of ATTRIBUTES) {
    const values = cards.map(c => c[attr]);
    if (new Set(values).size === 1) {
      count++;
    }
  }
  return count;
}

/**
 * Count how many attributes have all-different values
 */
export function countDifferentAttributes(cards: Card[]): number {
  let count = 0;
  for (const attr of ATTRIBUTES) {
    const values = cards.map(c => c[attr]);
    if (new Set(values).size === 4) {
      count++;
    }
  }
  return count;
}

/**
 * Check if 4 cards form a valid SET
 */
export function isValidSet(cards: Card[]): boolean {
  if (cards.length !== 4) return false;

  for (const attr of ATTRIBUTES) {
    const values = cards.map(c => c[attr]);
    if (!isValidAttribute(values)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a set matches the difficulty requirements
 */
export function matchesDifficulty(cards: Card[], difficulty: Difficulty): boolean {
  if (!isValidSet(cards)) return false;

  const sameCount = countSameAttributes(cards);

  switch (difficulty) {
    case 'easy':
      // Must have at least 1 attribute where all 4 are the same
      return sameCount >= 1;
    case 'medium':
      // Any valid set is allowed
      return true;
    case 'hard':
      // Any valid set is allowed, but we prefer those with more "all different"
      return true;
  }
}

/**
 * Calculate difficulty score for ranking sets
 * Higher score = harder set
 */
export function getDifficultyScore(cards: Card[]): number {
  const differentCount = countDifferentAttributes(cards);
  return differentCount;
}

/**
 * Find all valid 4-card sets among the given cards
 */
export function findAllSets(cards: Card[]): Card[][] {
  const sets: Card[][] = [];

  for (let i = 0; i < cards.length - 3; i++) {
    for (let j = i + 1; j < cards.length - 2; j++) {
      for (let k = j + 1; k < cards.length - 1; k++) {
        for (let l = k + 1; l < cards.length; l++) {
          const combo = [cards[i], cards[j], cards[k], cards[l]];
          if (isValidSet(combo)) {
            sets.push(combo);
          }
        }
      }
    }
  }

  return sets;
}

/**
 * Filter sets by difficulty level
 */
export function filterSetsByDifficulty(sets: Card[][], difficulty: Difficulty): Card[][] {
  return sets.filter(set => matchesDifficulty(set, difficulty));
}

/**
 * Rank sets by difficulty preference
 * For easy: prefer sets with more "all same" attributes
 * For hard: prefer sets with more "all different" attributes
 */
export function rankSetsByDifficulty(sets: Card[][], difficulty: Difficulty): Card[][] {
  const filtered = filterSetsByDifficulty(sets, difficulty);

  if (filtered.length === 0) return [];

  return [...filtered].sort((a, b) => {
    const scoreA = getDifficultyScore(a);
    const scoreB = getDifficultyScore(b);

    if (difficulty === 'easy') {
      // Prefer lower scores (fewer "all different")
      return scoreA - scoreB;
    } else if (difficulty === 'hard') {
      // Prefer higher scores (more "all different")
      return scoreB - scoreA;
    }
    // Medium: random order
    return Math.random() - 0.5;
  });
}

/**
 * Check if there's at least one valid set on the table for the given difficulty
 */
export function hasValidSet(cards: Card[], difficulty: Difficulty): boolean {
  const allSets = findAllSets(cards);
  const validSets = filterSetsByDifficulty(allSets, difficulty);
  return validSets.length > 0;
}

/**
 * Get a hint (return the first valid set for the difficulty)
 */
export function getHint(cards: Card[], difficulty: Difficulty): Card[] | null {
  const allSets = findAllSets(cards);
  const rankedSets = rankSetsByDifficulty(allSets, difficulty);
  return rankedSets.length > 0 ? rankedSets[0] : null;
}
