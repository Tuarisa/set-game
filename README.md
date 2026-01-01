# SET Game Trainer

A mobile-first browser game trainer for the SET card game variant. Find 4 cards where each attribute (color, shape, fill, count) is either all same or all different across the selected cards.

## Features

- **4-Card SET variant**: Find sets of 4 cards instead of traditional 3
- **Three difficulty levels**:
  - Easy: Sets must have at least 1 matching attribute
  - Medium: Any valid set
  - Hard: Prefers sets with more "all different" attributes
- **Score tracking**: Best and last scores saved per difficulty
- **Hint system**: Get help finding valid sets
- **Mobile-first design**: Optimized for phone browsers
- **Offline-ready**: Works without internet after first load

## Tech Stack

- React 19 + TypeScript
- Vite 7
- TailwindCSS 4
- Vitest for testing

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for static deployment on Vercel:

```bash
npm run build
# Deploy the `dist` folder
```

## Game Rules

1. Each card has 4 attributes:
   - **Color**: red, green, purple
   - **Shape**: oval, diamond, squiggle
   - **Fill**: solid, striped, empty
   - **Count**: 1, 2, or 3 symbols

2. Select 4 cards that form a valid SET:
   - For each attribute, all 4 cards must have either:
     - The **same** value (e.g., all red)
     - **All different** values (e.g., 1, 2, 3, and... wait, we only have 3 values!)
   - Actually, with 3 values per attribute and 4 cards, "all different" for 4 unique values isn't possible
   - So valid SETs have **all same** for each attribute

3. Scoring:
   - +10 points for correct SET
   - -3 points for incorrect selection

## Project Structure

```
src/
├── components/         # React UI components
│   ├── CardView.tsx    # Single card rendering
│   ├── GameBoard.tsx   # Card grid layout
│   ├── Controls.tsx    # New Game, Hint buttons
│   ├── DifficultySelector.tsx
│   ├── ScorePanel.tsx
│   └── Message.tsx     # Feedback messages
├── logic/              # Game logic
│   ├── types.ts        # TypeScript types
│   ├── deck.ts         # Deck generation
│   ├── sets.ts         # SET validation
│   ├── game.ts         # Game state management
│   └── storage.ts      # localStorage wrapper
└── App.tsx             # Main app component
```
