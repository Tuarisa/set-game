import { describe, it, expect } from 'vitest';
import { createFullDeck, shuffleDeck, getCardsByIds, removeCardsByIds } from './deck';

describe('createFullDeck', () => {
  it('creates exactly 81 unique cards', () => {
    const deck = createFullDeck();

    expect(deck.length).toBe(81);

    // Check all cards are unique
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(81);
  });

  it('creates cards with all combinations of attributes', () => {
    const deck = createFullDeck();

    // Count unique values for each attribute
    const colors = new Set(deck.map(c => c.color));
    const shapes = new Set(deck.map(c => c.shape));
    const fills = new Set(deck.map(c => c.fill));
    const counts = new Set(deck.map(c => c.count));

    expect(colors.size).toBe(3);
    expect(shapes.size).toBe(3);
    expect(fills.size).toBe(3);
    expect(counts.size).toBe(3);
  });

  it('each card has correct id format', () => {
    const deck = createFullDeck();

    deck.forEach(card => {
      const expectedId = `${card.color}-${card.shape}-${card.fill}-${card.count}`;
      expect(card.id).toBe(expectedId);
    });
  });
});

describe('shuffleDeck', () => {
  it('returns an array of the same length', () => {
    const deck = createFullDeck();
    const shuffled = shuffleDeck(deck);

    expect(shuffled.length).toBe(deck.length);
  });

  it('contains the same cards', () => {
    const deck = createFullDeck();
    const shuffled = shuffleDeck(deck);

    const originalIds = new Set(deck.map(c => c.id));
    const shuffledIds = new Set(shuffled.map(c => c.id));

    expect(shuffledIds).toEqual(originalIds);
  });

  it('does not modify the original array', () => {
    const deck = createFullDeck();
    const originalFirst = deck[0];
    shuffleDeck(deck);

    expect(deck[0]).toBe(originalFirst);
  });

  it('actually changes the order (probabilistic)', () => {
    const deck = createFullDeck();
    const shuffled = shuffleDeck(deck);

    // It's extremely unlikely that the first 10 cards remain in order
    let samePositionCount = 0;
    for (let i = 0; i < 10; i++) {
      if (deck[i].id === shuffled[i].id) {
        samePositionCount++;
      }
    }

    // Allow up to 3 cards in same position (very generous)
    expect(samePositionCount).toBeLessThan(5);
  });
});

describe('getCardsByIds', () => {
  it('returns cards matching the given ids', () => {
    const deck = createFullDeck();
    const idsToFind = [deck[0].id, deck[10].id, deck[50].id];

    const found = getCardsByIds(deck, idsToFind);

    expect(found.length).toBe(3);
    expect(found.map(c => c.id)).toEqual(expect.arrayContaining(idsToFind));
  });

  it('returns empty array when no ids match', () => {
    const deck = createFullDeck();
    const found = getCardsByIds(deck, ['nonexistent-id']);

    expect(found.length).toBe(0);
  });
});

describe('removeCardsByIds', () => {
  it('removes cards with the given ids', () => {
    const deck = createFullDeck();
    const idsToRemove = [deck[0].id, deck[10].id];

    const remaining = removeCardsByIds(deck, idsToRemove);

    expect(remaining.length).toBe(79);
    expect(remaining.find(c => c.id === deck[0].id)).toBeUndefined();
    expect(remaining.find(c => c.id === deck[10].id)).toBeUndefined();
  });

  it('returns original array if no ids match', () => {
    const deck = createFullDeck();
    const remaining = removeCardsByIds(deck, ['nonexistent-id']);

    expect(remaining.length).toBe(81);
  });

  it('does not modify the original array', () => {
    const deck = createFullDeck();
    const originalLength = deck.length;
    removeCardsByIds(deck, [deck[0].id]);

    expect(deck.length).toBe(originalLength);
  });
});
