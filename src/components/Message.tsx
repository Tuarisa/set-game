interface MessageProps {
  message: string | null;
}

export function Message({ message }: MessageProps) {
  if (!message) return null;

  const isPositive = message.includes('+') || message.includes('Correct');
  const isNegative = message.includes('-') || message.includes('Not a valid');
  const isGameOver = message.includes('Game Over');

  return (
    <div
      className={`
        py-2 px-4 rounded-lg text-center font-medium text-sm sm:text-base
        animate-fade-in
        ${isPositive ? 'bg-green-100 text-green-700' : ''}
        ${isNegative ? 'bg-red-100 text-red-700' : ''}
        ${isGameOver ? 'bg-purple-100 text-purple-700' : ''}
        ${!isPositive && !isNegative && !isGameOver ? 'bg-yellow-100 text-yellow-700' : ''}
      `}
    >
      {message}
    </div>
  );
}
