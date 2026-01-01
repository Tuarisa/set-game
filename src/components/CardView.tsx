import type { Card } from '../logic/types';

interface CardViewProps {
  card: Card;
  isSelected: boolean;
  onClick: () => void;
}

const colorMap = {
  red: '#e53e3e',
  green: '#38a169',
  purple: '#805ad5',
};

const Shape = ({ shape, fill, color }: { shape: Card['shape']; fill: Card['fill']; color: Card['color'] }) => {
  const fillColor = colorMap[color];
  const strokeColor = colorMap[color];

  const getFillStyle = () => {
    switch (fill) {
      case 'solid':
        return fillColor;
      case 'empty':
        return 'transparent';
      case 'striped':
        return `url(#stripe-${color})`;
    }
  };

  const renderShape = () => {
    switch (shape) {
      case 'oval':
        return (
          <ellipse
            cx="25"
            cy="20"
            rx="18"
            ry="15"
            fill={getFillStyle()}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'diamond':
        return (
          <polygon
            points="25,5 45,20 25,35 5,20"
            fill={getFillStyle()}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'squiggle':
        // Classic SET squiggle - S-shaped blob
        return (
          <path
            d="M 8,28 C 8,22 12,18 16,18 C 20,18 22,22 26,22 C 30,22 32,18 36,18 C 40,18 44,22 44,28 C 44,32 40,36 36,36 C 32,36 30,32 26,32 C 22,32 20,36 16,36 C 12,36 8,32 8,28 Z"
            fill={getFillStyle()}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
    }
  };

  return (
    <svg width="50" height="40" viewBox="0 0 50 40">
      <defs>
        {/* Stripe patterns for each color */}
        <pattern id={`stripe-${color}`} patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0" x2="0" y2="4" stroke={strokeColor} strokeWidth="1.5" />
        </pattern>
      </defs>
      {renderShape()}
    </svg>
  );
};

export function CardView({ card, isSelected, onClick }: CardViewProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-0.5 p-2
        bg-white rounded-xl shadow-md
        transition-all duration-200 ease-out
        active:scale-95
        ${isSelected
          ? 'ring-4 ring-purple-500 ring-offset-2 shadow-lg scale-105'
          : 'hover:shadow-lg hover:scale-[1.02]'
        }
        w-full aspect-[3/4] min-h-[100px]
        cursor-pointer
      `}
      aria-pressed={isSelected}
      aria-label={`${card.count} ${card.color} ${card.fill} ${card.shape}${card.count > 1 ? 's' : ''}`}
    >
      {Array.from({ length: card.count }).map((_, i) => (
        <Shape key={i} shape={card.shape} fill={card.fill} color={card.color} />
      ))}
    </button>
  );
}
