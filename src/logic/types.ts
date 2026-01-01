export type Color = 'red' | 'green' | 'purple';
export type Shape = 'oval' | 'diamond' | 'squiggle';
export type Fill = 'solid' | 'striped' | 'empty';
export type Count = 1 | 2 | 3;

export interface Card {
  id: string;
  color: Color;
  shape: Shape;
  fill: Fill;
  count: Count;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  deck: Card[];
  table: Card[];
  selectedIds: string[];
  score: number;
  difficulty: Difficulty;
  message: string | null;
  gameOver: boolean;
}

export interface ScoreData {
  bestScore: number;
  lastScore: number;
}

export type ScoresByDifficulty = Record<Difficulty, ScoreData>;
