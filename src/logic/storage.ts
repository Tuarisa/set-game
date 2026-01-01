import type { Difficulty, ScoreData, ScoresByDifficulty } from './types';

const STORAGE_KEY = 'set-game-scores';

const defaultScoreData: ScoreData = {
  bestScore: 0,
  lastScore: 0,
};

const defaultScores: ScoresByDifficulty = {
  easy: { ...defaultScoreData },
  medium: { ...defaultScoreData },
  hard: { ...defaultScoreData },
  real: { ...defaultScoreData },
};

/**
 * Load scores from localStorage
 */
export function loadScores(): ScoresByDifficulty {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultScores;

    const parsed = JSON.parse(stored) as Partial<ScoresByDifficulty>;

    // Merge with defaults to handle missing fields
    return {
      easy: { ...defaultScoreData, ...parsed.easy },
      medium: { ...defaultScoreData, ...parsed.medium },
      hard: { ...defaultScoreData, ...parsed.hard },
      real: { ...defaultScoreData, ...parsed.real },
    };
  } catch {
    return defaultScores;
  }
}

/**
 * Save scores to localStorage
 */
export function saveScores(scores: ScoresByDifficulty): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Ignore storage errors (e.g., private browsing mode)
  }
}

/**
 * Get scores for a specific difficulty
 */
export function getScoreForDifficulty(difficulty: Difficulty): ScoreData {
  const scores = loadScores();
  return scores[difficulty];
}

/**
 * Update scores for a specific difficulty after game ends
 */
export function updateScore(difficulty: Difficulty, finalScore: number): ScoreData {
  const scores = loadScores();
  const current = scores[difficulty];

  const updated: ScoreData = {
    lastScore: finalScore,
    bestScore: Math.max(current.bestScore, finalScore),
  };

  scores[difficulty] = updated;
  saveScores(scores);

  return updated;
}

/**
 * Reset all scores (for testing/debugging)
 */
export function resetAllScores(): void {
  localStorage.removeItem(STORAGE_KEY);
}
