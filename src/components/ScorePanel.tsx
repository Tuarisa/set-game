import type { ScoreData } from '../logic/types';

interface ScorePanelProps {
  currentScore: number;
  scoreData: ScoreData;
  remainingCards: number;
}

export function ScorePanel({ currentScore, scoreData, remainingCards }: ScorePanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
            {currentScore}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Score</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {scoreData.bestScore}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Best</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-600">
            {scoreData.lastScore}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Last</div>
        </div>
      </div>
      <div className="mt-3 text-center text-sm text-gray-500">
        {remainingCards} cards remaining
      </div>
    </div>
  );
}
