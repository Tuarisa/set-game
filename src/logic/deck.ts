import type { Card, Color, Shape, Fill, Count } from './types';

const COLORS: Color[] = ['red', 'green', 'purple'];
const SHAPES: Shape[] = ['oval', 'diamond', 'squiggle'];
const FILLS: Fill[] = ['solid', 'striped', 'empty'];
const COUNTS: Count[] = [1, 2, 3];

/**
 * Generate a complete deck of 81 unique cards
 * (3 colors × 3 shapes × 3 fills × 3 counts = 81)
 */
export function createFullDeck(): Card[] {
  const deck: Card[] = [];

  for (const color of COLORS) {
    for (const shape of SHAPES) {
      for (const fill of FILLS) {
        for (const count of COUNTS) {
          deck.push({
            id: `${color}-${shape}-${fill}-${count}`,
            color,
            shape,
            fill,
            count,
          });
        }
      }
    }
  }

  return deck;
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleDeck<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get cards by their IDs
 */
export function getCardsByIds(cards: Card[], ids: string[]): Card[] {
  const idSet = new Set(ids);
  return cards.filter(card => idSet.has(card.id));
}

/**
 * Remove cards from array by IDs
 */
export function removeCardsByIds(cards: Card[], ids: string[]): Card[] {
  const idSet = new Set(ids);
  return cards.filter(card => !idSet.has(card.id));
}
