# Cards with Stan — SPEC.md

## Overview
"Cards with Stan" is a Higher or Lower card game webapp where the player plays against Stan (a snarky cat). The app is deployed as a static site on GitHub Pages. Game logic is completely separated from UI logic (pure functions) and is fully unit-tested with Vitest.

**Live site:** https://drewwal.github.io/play-stan-webapp/

## Goals
- Provide a polished, playable higher/lower card game in the browser.
- Maintain correct deck logic: uniform randomness over the remaining cards, no duplicates, correct remaining card count.
- Track chips and betting with deterministic rules.
- Stan has personality — randomized cheeky commentary reacts to wins, losses, ties, game over, and game start.
- Make it easy to extend later (e.g., hard mode where probabilities are biased / "Stan cheats").

## Non-goals
- No accounts, persistence, multiplayer, leaderboards.
- No backend required.

---

## Game Rules

### Deck
- Standard 52-card deck:
  - Suits: Clubs, Diamonds, Hearts, Spades
  - Ranks: 2–10, J, Q, K, A
- Rank ordering (low to high): 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
- The deck is uniformly randomized at game start using a Fisher-Yates shuffle. Cards are drawn from the top each round.
- Cards are drawn without replacement.
- The UI shows the number of cards remaining in the status bar.

### Round Flow
1. A current card is visible with rank and suit symbol displayed as a styled card.
2. The player chooses:
   - **Guess:** Higher or Lower (toggle buttons, highlighted when selected)
   - **Bet amount:** integer between 1 and current chips (inclusive), using a stepper with +/- buttons, Half, and Max quick-bet shortcuts.
3. Player presses **Commit**.
4. The next card is drawn. The result is evaluated and displayed:
   - If next rank is strictly higher than current and guess = Higher -> **win**
   - If next rank is strictly lower than current and guess = Lower -> **win**
   - If ranks are equal -> **loss** (tie = loss)
5. Chips update: win -> +bet, loss -> -bet.
6. Stan delivers a randomized commentary message based on the outcome (win amount, loss amount, tie, game over reason).
7. The drawn card becomes the new current card for the following round.
8. Guess and bet are reset for the next round.

### Betting / Chips
- Starting chips: **3**
- Bet constraints:
  - Must be an integer.
  - Must satisfy `1 <= bet <= chips`.
- Quick-bet buttons:
  - **Half:** sets bet to `max(1, floor(chips / 2))`
  - **Max:** sets bet to current chip count
- Chip updates:
  - Win: chips += bet
  - Loss: chips -= bet

### End Conditions
- **Game Over (chips):** chips reach 0 -> game ends, Commit is disabled.
- **Game Over (deck):** no remaining cards to draw -> game ends, Commit is disabled.
- **New Game** button (always available in the status bar) resets:
  - Chips to 3
  - Fresh shuffled deck
  - Current card drawn from the new deck
  - Clears guess/bet inputs
  - Stan delivers a new welcome message

---

## UI Design

### Layout
The app uses a two-column grid layout inside a white rounded container, with a pastel gradient background (blue/pink/green). Mobile-responsive — collapses gracefully on narrow viewports.

### Header
- Title: **"Cards with Stan"** — large italic gradient text (pink/coral/gold), slightly rotated, with an animated gradient shift effect.

### Status Bar (top of game container, full width)
- Pink gradient bar displaying:
  - **Chips:** current chip count
  - **Cards Left:** remaining deck size
  - **New Game** button (white with purple border, hover inverts)

### Stan's Commentary (full width, below status bar)
- Stan's circular avatar (`cat.jpg`) on the left with a speech bubble on the right.
- Speech bubble has a CSS arrow pointing to the avatar.
- Messages fade in with a CSS animation.
- Stan's messages are randomized from pools based on context:
  - **Start:** explains game rules in a cheeky way
  - **Win:** varies by bet size (1, 2, or 3+ chips)
  - **Loss:** varies by bet size and whether it was a tie
  - **Game Over (chips):** broke/bankrupt messages
  - **Game Over (deck):** reports final chip count

### Card Area (left column)
- Label: "Current Card"
- Styled card component showing rank (large) and suit symbol (large) on a white card with rounded corners and shadow.
- Red suits (Hearts, Diamonds) render in red; black suits (Clubs, Spades) render in black.
- After a commit, a result indicator appears below the card:
  - Win: green checkmark "You won!" with chip delta
  - Loss: pink X "You lost!" with chip delta

### Controls (right column)
- **Bet section:**
  - Label: "Bet Your Chips:"
  - Stepper row: **-** button, number input, **+** button
  - Quick-bet row: **Half: N** and **Max: N** buttons
- **Guess section:**
  - Label: "Guess:"
  - Two buttons: **Down Arrow Lower** (pink/red tint when selected) and **Up Arrow Higher** (green tint when selected)
- **Commit button:**
  - Centered below controls
  - Disabled (greyed out) unless a guess is selected, bet is valid, and game is not over

### Accessibility / UX
- All buttons have aria-labels where appropriate.
- Keyboard navigation works for guess selection and commit.
- Responsive layout adapts to mobile widths (smaller cards, text, padding).

---

## Architecture

### Project Structure
```
src/
  App.tsx          — Main React component (UI state, event handlers)
  App.css          — All styling (responsive grid, cards, speech bubble, etc.)
  main.tsx         — React entry point
  index.css        — Global styles / background gradient
  assets/
    cat.jpg        — Stan's avatar image
  components/
    CardDisplay.tsx — Reusable card rendering component
  game/
    index.ts       — Barrel export for game module
    types.ts       — Type definitions (Card, Suit, Rank, GameState, etc.)
    game.ts        — Pure game logic functions
    stanMessages.ts — Stan's randomized commentary system
    game.test.ts   — Unit tests (Vitest)
```

### Game Logic Separation
All core game logic lives in `src/game/` as pure functions with no DOM/UI dependencies. The UI layer (React) consumes `GameState` and calls game functions, but never implements card/deck math.

### Types
```typescript
type Suit = "C" | "D" | "H" | "S"
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
interface Card { suit: Suit; rank: Rank }
type Guess = "higher" | "lower"
type Outcome = "win" | "loss"

interface GameState {
  chips: number;
  deck: Card[];
  currentCard: Card;
  lastDrawnCard?: Card;
  lastOutcome?: Outcome;
  lastDelta?: number;
  message?: string;
  gameOver: boolean;
}
```

### Core Functions
- **`newDeck(): Card[]`** — Creates a 52-card deck in deterministic order.
- **`shuffle(deck, rng?): Card[]`** — Returns a shuffled copy (Fisher-Yates). Optional injected RNG for testability.
- **`draw(deck): { card, deck }`** — Draws the top card. Throws on empty deck.
- **`initialState(): GameState`** — Shuffles deck, draws current card, sets chips=3, generates welcome message.
- **`commitGuess(state, guess, bet): GameState`** — Validates inputs, draws next card, computes win/loss (tie=loss), updates chips, checks game over, generates Stan message.

### Stan's Message System (`stanMessages.ts`)
- `getStanMessage(context: MessageContext): string` — Selects a random message from categorized pools.
- Messages are organized by outcome and further by bet size, tie status, or game-over reason.
- Each category has 8-14 unique messages for variety.

### Validations
- `commitGuess` returns state with an error message (no mutation) for:
  - Non-integer bets
  - Bet out of range (< 1 or > chips)
  - Game already over
  - Empty deck

---

## Testing
Unit tests use **Vitest** with jsdom environment. 29 tests across 5 describe blocks:

1. **`newDeck`** — 52 unique cards, all ranks and suits present.
2. **`shuffle`** — 52 cards returned, uniqueness preserved, input not mutated, deterministic with injected RNG.
3. **`draw`** — Deck size reduced by 1, drawn card absent from remaining deck, input not mutated, throws on empty deck.
4. **`initialState`** — 3 chips, 51-card deck, valid current card, not game over, welcome message present.
5. **`commitGuess`** — Validation (bad bets, game over no-op), win/loss chip arithmetic, tie = loss, game over on zero chips, game over on deck exhaustion, state immutability.

Run tests: `npm test` (watch mode) or `npx vitest run` (single run).

---

## Assets
- `src/assets/cat.jpg` — Stan's avatar (imported in React).
- `public/cat.jpg` — Also in public for direct access.
- Cards are rendered as styled HTML/CSS components (rank + suit symbol), not image assets.

---

## Tech Stack
- **React 19** + **TypeScript 5.9**
- **Vite 7** (dev server + build)
- **Vitest 4** (testing, jsdom environment)
- **ESLint 9** (linting)
- **gh-pages** (deployment to GitHub Pages)

## Scripts
- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite production build to `dist/`
- `npm test` — Run Vitest in watch mode
- `npx vitest run` — Single test run
- `npm run lint` — ESLint
- `npm run deploy` — Build and deploy to GitHub Pages

---

## Deployment
- Deployed as a static site on **GitHub Pages** via the `gh-pages` npm package.
- Base path: `/play-stan-webapp/`
- `npm run deploy` builds and pushes to the `gh-pages` branch.

---

## Acceptance Criteria
- User can play multiple rounds until chips == 0 or deck is exhausted.
- Betting and chip arithmetic works exactly as specified.
- Tie is always a loss.
- Remaining card count is correct and decreases on each commit.
- No card appears twice in a single game.
- Commit button disables correctly when no guess selected, invalid bet, or game over.
- Stan delivers varied, contextual commentary on every game event.
- Game logic has full unit test coverage (29 tests passing).
- `New Game` resets everything (except shuffle randomness).
- App is responsive and works on mobile.
- Deployed and accessible at GitHub Pages URL.
