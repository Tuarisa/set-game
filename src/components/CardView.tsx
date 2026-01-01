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
        // Pill/capsule shape - horizontally elongated
        return (
          <rect
            x="3"
            y="10"
            width="44"
            height="20"
            rx="10"
            ry="10"
            fill={getFillStyle()}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'diamond':
        return (
          <polygon
            points="25,4 47,20 25,36 3,20"
            fill={getFillStyle()}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'squiggle':
        // Tilde-like wave shape ~ with rounded ends
        return (
          <path
            d="M 3,26
               C 8,26 10,32 17,32
               C 24,32 26,20 33,20
               C 40,20 42,26 47,26
               C 50,26 50,14 47,14
               C 42,14 40,8 33,8
               C 26,8 24,20 17,20
               C 10,20 8,14 3,14
               C 0,14 0,26 3,26
               Z"
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
