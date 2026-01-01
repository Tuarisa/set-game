import { useState, useCallback, useEffect } from 'react';
import type { Difficulty, GameState, ScoreData } from './logic/types';
import { initializeGame, selectCard, getRemainingCards } from './logic/game';
import { getHint } from './logic/sets';
import { getScoreForDifficulty, updateScore } from './logic/storage';
import {
  GameBoard,
  DifficultySelector,
  ScorePanel,
  Controls,
  Message,
  SuccessPopup,
} from './components';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(difficulty));
  const [scoreData, setScoreData] = useState<ScoreData>(() => getScoreForDifficulty(difficulty));
  const [hintCards, setHintCards] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load score data when difficulty changes
  useEffect(() => {
    setScoreData(getScoreForDifficulty(difficulty));
  }, [difficulty]);

  // Save score when game ends
  useEffect(() => {
    if (gameState.gameOver) {
      const updated = updateScore(difficulty, gameState.score);
      setScoreData(updated);
    }
  }, [gameState.gameOver, gameState.score, difficulty]);

  // Clear hint when cards change
  useEffect(() => {
    setHintCards([]);
  }, [gameState.table]);

  // Show success popup when correct set is found
  useEffect(() => {
    if (gameState.message?.includes('Correct')) {
      setSuccessMessage(gameState.message);
    }
  }, [gameState.message]);

  const handleNewGame = useCallback(() => {
    setGameState(initializeGame(difficulty));
    setScoreData(getScoreForDifficulty(difficulty));
    setHintCards([]);
  }, [difficulty]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setGameState(initializeGame(newDifficulty));
    setScoreData(getScoreForDifficulty(newDifficulty));
    setHintCards([]);
  }, []);

  const handleCardClick = useCallback((cardId: string) => {
    setGameState(prev => selectCard(prev, cardId));
    setHintCards([]);
  }, []);

  const handleHint = useCallback(() => {
    const hint = getHint(gameState.table, gameState.difficulty);
    if (hint) {
      setHintCards(hint.map(c => c.id));
    }
  }, [gameState.table, gameState.difficulty]);

  const remainingCards = getRemainingCards(gameState);

  // Combine selected cards with hint cards for highlighting
  const highlightedIds = [...gameState.selectedIds, ...hintCards];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 select-none safe-area-inset">
      {/* Success Popup */}
      <SuccessPopup
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
      />

      <div className="max-w-lg mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
            SET Trainer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find 3 cards where each attribute is all same or all different
          </p>
        </header>

        {/* Score Panel */}
        <ScorePanel
          currentScore={gameState.score}
          scoreData={scoreData}
          remainingCards={remainingCards}
        />

        {/* Difficulty Selector */}
        <DifficultySelector
          difficulty={difficulty}
          onChange={handleDifficultyChange}
          disabled={false}
        />

        {/* Message */}
        <Message message={gameState.message} />

        {/* Hint indicator */}
        {hintCards.length > 0 && !gameState.message && (
          <div className="py-2 px-4 rounded-lg text-center font-medium text-sm bg-blue-100 text-blue-700 animate-fade-in">
            Hint: highlighted cards form a valid set
          </div>
        )}

        {/* Game Board */}
        <GameBoard
          cards={gameState.table}
          selectedIds={highlightedIds}
          onCardClick={handleCardClick}
        />

        {/* Controls */}
        <Controls
          onNewGame={handleNewGame}
          onHint={handleHint}
          gameOver={gameState.gameOver}
        />

        {/* Selection count */}
        {!gameState.gameOver && gameState.selectedIds.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            {gameState.selectedIds.length}/3 cards selected
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
