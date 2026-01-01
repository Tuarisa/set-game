import { describe, it, expect } from 'vitest';
import type { Card } from './types';
import {
  isValidSet,
  matchesDifficulty,
  countSameAttributes,
  countDifferentAttributes,
  findAllSets,
  filterSetsByDifficulty,
  rankSetsByDifficulty,
} from './sets';

// Helper to create test cards
function createCard(
  color: Card['color'],
  shape: Card['shape'],
  fill: Card['fill'],
  count: Card['count']
): Card {
  return {
    id: `${color}-${shape}-${fill}-${count}`,
    color,
    shape,
    fill,
    count,
  };
}

describe('isValidSet', () => {
  it('returns true for all same attributes', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
    ];

    expect(isValidSet(cards)).toBe(true);
  });

  it('returns true for all different attributes', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(isValidSet(cards)).toBe(true);
  });

  it('returns true for mixed same/different attributes', () => {
    // Same color (all red), different count (1,2,3), same shape (oval), same fill (solid)
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    expect(isValidSet(cards)).toBe(true);
  });

  it('returns false when not exactly 3 cards', () => {
    const twoCards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
    ];

    const fourCards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
      createCard('red', 'oval', 'solid', 1),
    ];

    expect(isValidSet(twoCards)).toBe(false);
    expect(isValidSet(fourCards)).toBe(false);
  });

  it('returns false when an attribute has 2 same and 1 different', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('green', 'oval', 'solid', 3), // color breaks the set
    ];

    // color: 2 red, 1 green (not all same, not all different)
    expect(isValidSet(cards)).toBe(false);
  });
});

describe('countSameAttributes', () => {
  it('counts attributes where all 3 cards have the same value', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
    ];

    // All 4 attributes are the same across all cards
    expect(countSameAttributes(cards)).toBe(4);
  });

  it('returns correct count for mixed sets', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    // color, shape, fill are same; count is different
    expect(countSameAttributes(cards)).toBe(3);
  });

  it('returns 0 when all attributes are different', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(countSameAttributes(cards)).toBe(0);
  });
});

describe('countDifferentAttributes', () => {
  it('returns 0 when all cards are identical', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 1),
    ];

    expect(countDifferentAttributes(cards)).toBe(0);
  });

  it('returns 4 when all attributes are different', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(countDifferentAttributes(cards)).toBe(4);
  });

  it('returns correct count for mixed sets', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    // Only count is different
    expect(countDifferentAttributes(cards)).toBe(1);
  });
});

describe('matchesDifficulty', () => {
  it('easy: requires at least 1 same attribute', () => {
    // 3 same attributes (color, shape, fill), 1 different (count)
    const validEasySet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    expect(matchesDifficulty(validEasySet, 'easy')).toBe(true);
  });

  it('easy: rejects sets with no same attributes', () => {
    // All 4 attributes are different
    const hardSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(matchesDifficulty(hardSet, 'easy')).toBe(false);
  });

  it('medium: any valid set is allowed', () => {
    const allDifferentSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(matchesDifficulty(allDifferentSet, 'medium')).toBe(true);
  });

  it('hard: any valid set is allowed', () => {
    const allDifferentSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    expect(matchesDifficulty(allDifferentSet, 'hard')).toBe(true);
  });

  it('returns false for invalid sets regardless of difficulty', () => {
    const invalidSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('green', 'oval', 'solid', 3), // color breaks it
    ];

    expect(matchesDifficulty(invalidSet, 'easy')).toBe(false);
    expect(matchesDifficulty(invalidSet, 'medium')).toBe(false);
    expect(matchesDifficulty(invalidSet, 'hard')).toBe(false);
  });
});

describe('findAllSets', () => {
  it('finds all valid 3-card combinations', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
      createCard('green', 'diamond', 'striped', 1), // This card won't form a set with the others
    ];

    const sets = findAllSets(cards);

    // Should find exactly 1 set (the 3 red oval solid cards)
    expect(sets.length).toBe(1);
    expect(sets[0].every(c => c.color === 'red')).toBe(true);
  });

  it('finds multiple sets when they exist', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'oval', 'solid', 1),
      createCard('purple', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('green', 'oval', 'solid', 2),
      createCard('purple', 'oval', 'solid', 2),
    ];

    const sets = findAllSets(cards);

    // Should find multiple sets
    expect(sets.length).toBeGreaterThan(1);
  });

  it('returns empty array when no valid sets exist', () => {
    const cards = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('green', 'oval', 'solid', 3), // breaks color rule
    ];

    const sets = findAllSets(cards);

    expect(sets.length).toBe(0);
  });
});

describe('filterSetsByDifficulty', () => {
  it('filters easy sets correctly', () => {
    const easySet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    const hardSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    const sets = [easySet, hardSet];

    // Easy filter should only include the easy set
    expect(filterSetsByDifficulty(sets, 'easy').length).toBe(1);

    // Medium and hard should include both
    expect(filterSetsByDifficulty(sets, 'medium').length).toBe(2);
    expect(filterSetsByDifficulty(sets, 'hard').length).toBe(2);
  });
});

describe('rankSetsByDifficulty', () => {
  it('ranks easy sets first for easy difficulty', () => {
    const easySet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('red', 'oval', 'solid', 2),
      createCard('red', 'oval', 'solid', 3),
    ];

    const sets = [easySet];

    const ranked = rankSetsByDifficulty(sets, 'easy');
    expect(ranked.length).toBe(1);
    expect(ranked[0]).toEqual(easySet);
  });

  it('returns empty array when no sets match difficulty', () => {
    const hardSet = [
      createCard('red', 'oval', 'solid', 1),
      createCard('green', 'diamond', 'striped', 2),
      createCard('purple', 'squiggle', 'empty', 3),
    ];

    const sets = [hardSet];

    // Easy requires at least 1 same attribute, this set has 0
    expect(rankSetsByDifficulty(sets, 'easy').length).toBe(0);
  });
});
