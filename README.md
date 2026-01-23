# Cards with Stan 🃏

A "Higher or Lower" card game where you play my cat. Be careful, he cheats. Built with React, TypeScript, and Vite.

**Play it live:** [https://drewwal.github.io/play-stan-webapp](https://drewwal.github.io/play-stan-webapp)

## How It Works

### Game Rules
- Start with 3 chips
- Each round, bet chips and guess if the next card will be **Higher** or **Lower**
- Win: double your bet. Lose: lose your bet
- **Ties count as losses!**
- Game ends when you run out of chips or cards

### Technical Architecture

The app is built with a clean separation between game logic and UI:

**Pure Game Logic** (`src/game/`)
- `types.ts` - TypeScript interfaces for Card, GameState, Guess, Outcome
- `game.ts` - Pure functions for deck creation, shuffling (Fisher-Yates), card drawing, and game state transitions
- `stanMessages.ts` - Context-aware personality system with 100+ cheeky messages
- `game.test.ts` - 29 unit tests covering all game logic

**React UI** (`src/`)
- `App.tsx` - Main game component with state management and event handlers
- `App.css` - Pastel gradient theme with responsive grid layout
- `components/CardDisplay.tsx` - Reusable card rendering component

## Project Structure

```
play-stan-webapp/
├── src/
│   ├── game/              # Pure game logic (framework-agnostic)
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── game.ts        # Core game functions
│   │   ├── stanMessages.ts # Cat personality system
│   │   ├── game.test.ts   # Unit tests
│   │   └── index.ts       # Barrel export
│   ├── components/
│   │   └── CardDisplay.tsx # Card rendering component
│   ├── assets/
│   │   └── cat.jpg        # Stan's avatar
│   ├── App.tsx            # Main React component
│   ├── App.css            # Styling
│   ├── index.css          # Global styles
│   └── main.tsx           # React entry point
├── public/                # Static assets
├── spec.md                # Detailed game specification
├── vite.config.ts         # Vite + Vitest configuration
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript configuration
```

## Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm test:ui
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Key Features

- **Pure Function Architecture**: Game logic is completely separate from UI, making it testable and reusable
- **Comprehensive Testing**: 29 unit tests ensure correct deck logic, betting, and win/loss conditions
- **Uniform Randomness**: Fisher-Yates shuffle ensures fair card distribution
- **Stan's Personality**: 100+ context-aware messages that react to your bets, wins, losses, and game state
- **Responsive Design**: Works on mobile and desktop with CSS Grid layout
- **Pastel Theme**: Fun, animated gradient background with playful styling

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool & dev server
- **Vitest 4.0** - Testing framework
- **CSS Grid & Flexbox** - Responsive layout
- **GitHub Pages** - Deployment

## License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
