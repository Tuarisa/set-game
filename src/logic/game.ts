import type { Card, Difficulty, GameState } from './types';
import { createFullDeck, shuffleDeck, removeCardsByIds } from './deck';
import { findAllSets, rankSetsByDifficulty, hasValidSet, isValidSet } from './sets';

const TABLE_SIZE = 12;
const POINTS_CORRECT = 10;
const POINTS_WRONG = 0; // No penalty - kid-friendly

/**
 * Generate a valid starting set for the given difficulty
 */
function generateValidSet(deck: Card[], difficulty: Difficulty): Card[] | null {
  // Find all possible 3-card combinations that form valid sets
  const allSets = findAllSets(deck);
  const rankedSets = rankSetsByDifficulty(allSets, difficulty);

  if (rankedSets.length === 0) return null;

  // Return the first (best-ranked) set for this difficulty
  return rankedSets[0];
}

/**
 * Initialize a new game with guaranteed valid set on the table
 */
export function initializeGame(difficulty: Difficulty): GameState {
  let deck = shuffleDeck(createFullDeck());

  // Generate a guaranteed valid set from the deck
  const guaranteedSet = generateValidSet(deck, difficulty);

  if (!guaranteedSet) {
    throw new Error('Could not generate a valid set for the difficulty');
  }

  // Remove the guaranteed set cards from deck
  const setIds = guaranteedSet.map(c => c.id);
  deck = removeCardsByIds(deck, setIds);

  // Take remaining cards to fill the table (TABLE_SIZE - 3)
  const remainingTableCards = deck.slice(0, TABLE_SIZE - 3);
  deck = deck.slice(TABLE_SIZE - 3);

  // Combine guaranteed set with remaining cards and shuffle
  const table = shuffleDeck([...guaranteedSet, ...remainingTableCards]);

  return {
    deck,
    table,
    selectedIds: [],
    score: 0,
    difficulty,
    message: null,
    gameOver: false,
  };
}

/**
 * Replenish the table after a successful set is found
 * Ensures at least one valid set exists
 */
export function replenishTable(state: GameState): GameState {
  let { deck, table, difficulty } = state;

  // If deck is empty and table has no valid sets, game over
  if (deck.length === 0 && !hasValidSet(table, difficulty)) {
    return {
      ...state,
      gameOver: true,
      message: 'Game Over! No more valid sets.',
    };
  }

  // Try to fill table to TABLE_SIZE
  const cardsNeeded = TABLE_SIZE - table.length;
  const cardsToAdd = Math.min(cardsNeeded, deck.length);

  if (cardsToAdd > 0) {
    table = [...table, ...deck.slice(0, cardsToAdd)];
    deck = deck.slice(cardsToAdd);
  }

  // Check if table has a valid set
  if (!hasValidSet(table, difficulty)) {
    // Try to add more cards until we have a valid set or run out of cards
    while (deck.length > 0 && !hasValidSet(table, difficulty)) {
      table = [...table, deck[0]];
      deck = deck.slice(1);
    }

    // If still no valid set and deck is empty, game over
    if (!hasValidSet(table, difficulty)) {
      return {
        ...state,
        deck,
        table,
        gameOver: true,
        message: 'Game Over! No more valid sets.',
      };
    }
  }

  return {
    ...state,
    deck,
    table,
    // Preserve success message if present
  };
}

/**
 * Handle card selection
 */
export function selectCard(state: GameState, cardId: string): GameState {
  if (state.gameOver) return state;

  const { selectedIds } = state;

  // Toggle selection
  if (selectedIds.includes(cardId)) {
    return {
      ...state,
      selectedIds: selectedIds.filter(id => id !== cardId),
      message: null,
    };
  }

  const newSelectedIds = [...selectedIds, cardId];

  // If less than 3 cards selected, just update selection
  if (newSelectedIds.length < 3) {
    return {
      ...state,
      selectedIds: newSelectedIds,
      message: null,
    };
  }

  // 3 cards selected - check if it's a valid set
  const selectedCards = state.table.filter(c => newSelectedIds.includes(c.id));

  if (isValidSet(selectedCards)) {
    // Valid set! Remove cards and add points
    const newTable = removeCardsByIds(state.table, newSelectedIds);
    const newState: GameState = {
      ...state,
      table: newTable,
      selectedIds: [],
      score: state.score + POINTS_CORRECT,
      message: 'Correct! +10 points',
    };

    return replenishTable(newState);
  } else {
    // Invalid set - no penalty, just try again
    return {
      ...state,
      selectedIds: [],
      message: 'Not a SET. Try again!',
    };
  }
}

/**
 * Get number of remaining cards (deck + table)
 */
export function getRemainingCards(state: GameState): number {
  return state.deck.length + state.table.length;
}
