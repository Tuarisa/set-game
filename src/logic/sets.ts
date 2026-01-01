import type { Card, Difficulty } from './types';

type AttributeKey = 'color' | 'shape' | 'fill' | 'count';
const ATTRIBUTES: AttributeKey[] = ['color', 'shape', 'fill', 'count'];

/**
 * Check if a single attribute forms a valid set pattern
 * (all same or all different across 3 cards)
 */
function isValidAttribute<T>(values: T[]): boolean {
  const unique = new Set(values);
  // For 3 cards: all same (1 unique) or all different (3 unique)
  return unique.size === 1 || unique.size === 3;
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
    if (new Set(values).size === 3) {
      count++;
    }
  }
  return count;
}

/**
 * Check if 3 cards form a valid SET
 */
export function isValidSet(cards: Card[]): boolean {
  if (cards.length !== 3) return false;

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
 * All difficulties accept any valid set - difficulty only affects
 * which sets are preferred/shown on the table
 */
export function matchesDifficulty(cards: Card[], _difficulty: Difficulty): boolean {
  // All difficulties accept any valid set
  return isValidSet(cards);
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
 * Find all valid 3-card sets among the given cards
 */
export function findAllSets(cards: Card[]): Card[][] {
  const sets: Card[][] = [];

  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const combo = [cards[i], cards[j], cards[k]];
        if (isValidSet(combo)) {
          sets.push(combo);
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
    // Medium/Real: random order
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
