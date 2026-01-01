import type { Card } from '../logic/types';
import { CardView } from './CardView';

interface GameBoardProps {
  cards: Card[];
  selectedIds: string[];
  onCardClick: (cardId: string) => void;
}

export function GameBoard({ cards, selectedIds, onCardClick }: GameBoardProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map(card => (
          <CardView
            key={card.id}
            card={card}
            isSelected={selectedIds.includes(card.id)}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
