import type { Difficulty } from '../logic/types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'At least 1 matching attribute' },
  { value: 'medium', label: 'Medium', description: 'Any valid set' },
  { value: 'hard', label: 'Hard', description: 'Prefer all-different attributes' },
  { value: 'real', label: 'Real', description: 'Classic SET - random sets' },
];

export function DifficultySelector({ difficulty, onChange, disabled }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">Difficulty</label>
      <div className="flex gap-1 sm:gap-2">
        {difficulties.map(d => (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            disabled={disabled}
            className={`
              flex-1 py-2 px-2 sm:px-3 rounded-lg text-sm font-medium
              transition-all duration-200
              ${difficulty === d.value
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={d.description}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
