interface ControlsProps {
  onNewGame: () => void;
  onHint: () => void;
  gameOver: boolean;
}

export function Controls({ onNewGame, onHint, gameOver }: ControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onNewGame}
        className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-medium
          shadow-md hover:bg-purple-700 active:scale-95 transition-all duration-200"
      >
        {gameOver ? 'Play Again' : 'New Game'}
      </button>
      {!gameOver && (
        <button
          onClick={onHint}
          className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium
            shadow-md hover:bg-gray-200 active:scale-95 transition-all duration-200"
        >
          Hint
        </button>
      )}
    </div>
  );
}
