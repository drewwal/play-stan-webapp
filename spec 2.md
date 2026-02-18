# Play Stan Webapp — SPEC.md

## Overview
A simple “Higher or Lower” card game webapp where the player plays against Stan (a cat). The app runs locally first, then can be deployed as a static site. Game logic must be kept separate from UI logic (pure functions where possible) and be testable.

## Goals
- Provide a playable higher/lower card game in the browser.
- Maintain correct deck logic: uniform randomness over the remaining cards, no duplicates, correct remaining card count.
- Track chips and betting with deterministic rules.
- Make it easy to extend later (e.g., hard mode where probabilities are biased / “Stan cheats”).

## Non-goals (for v1)
- No accounts, persistence, multiplayer, leaderboards.
- No backend required.
- No animations or advanced styling required (basic CSS acceptable).

---

## Game Rules

### Deck
- Standard 52-card deck:
  - Suits: Clubs, Diamonds, Hearts, Spades
  - Ranks: 2–10, J, Q, K, A
- Rank ordering (low → high): 2,3,4,5,6,7,8,9,10,J,Q,K,A
- The deck is uniformly randomized at game start.
  - Implementation requirement: shuffle the full deck once at start (e.g., Fisher–Yates) and draw from the top each round, or otherwise ensure equal probability for each remaining card.
- Cards are drawn without replacement.
- The UI must show the number of cards remaining.

### Round Flow
1. A current card is visible (“Current card”).
2. The player chooses:
   - Guess: **Higher** or **Lower**
   - Bet amount: integer between 1 and current chips (inclusive)
3. Player presses **Commit**.
4. The next card is drawn and revealed.
5. Result is evaluated:
   - If next rank is strictly higher than current and guess = Higher → win
   - If next rank is strictly lower than current and guess = Lower → win
   - If ranks are equal → **loss** (tie = loss)
6. Chips update based on bet outcome (see below).
7. The next card becomes the new current card for the following round.

### Betting / Chips
- Starting chips: **3**
- Bet constraints:
  - Must be an integer.
  - Must satisfy `1 <= bet <= chips`.
- Chip updates:
  - Win: player gains winnings equal to the bet amount (net +bet).
    - Example: chips=3, bet=2 → win → chips becomes 5
  - Loss: player loses the bet amount (net −bet).
    - Example: chips=3, bet=2 → loss → chips becomes 1

### End Conditions
- **Game Over (chips):** if chips reach 0, the game ends and Commit is disabled.
- **Game Over (deck):** if there are no remaining cards to draw:
  - The game ends and Commit is disabled.
- Provide a **New Game** button that resets:
  - chips to 3
  - a fresh shuffled deck
  - current card drawn from the new deck
  - clears guess/bet inputs and messages

---

## UI Requirements (v1)

### Layout / Elements
- Title: “Play Stan”
- Stan image displayed using `cat.jpg` (initial placeholder asset).
- Card display:
  - Show the current card (rank + suit, or a visual card asset if available).
  - After commit, reveal the next card and show round result.
- Controls:
  - Bet input (number input or stepper) constrained by chips.
  - Guess selection (Higher / Lower) — toggle or buttons.
  - Commit button:
    - Disabled unless:
      - a guess is selected
      - bet is valid
      - game is not over
  - New Game button (always available).
- Status area:
  - Chips remaining
  - Cards remaining in deck
  - Last result message: Win/Loss and chip delta

### Accessibility / UX
- All buttons have labels.
- Keyboard navigation should work for guess selection and commit.
- Basic responsive layout (works on mobile width).

---

## Game Logic Separation

### Structure
- Put all core game logic in a dedicated module (pure functions; no DOM/UI calls).
  - Example path: `src/game/`
- UI layer (React components) consumes game state and dispatches actions, but does not implement card/deck math.

### Suggested Types (conceptual)
- `Suit = "C" | "D" | "H" | "S"` (or full names)
- `Rank = 2..14` (where 11=J, 12=Q, 13=K, 14=A)
- `Card = { suit: Suit; rank: Rank }`
- `GameState = {
    chips: number;
    deck: Card[];          // remaining cards to draw
    currentCard: Card;     // visible card
    lastDrawnCard?: Card;  // card revealed on commit
    lastOutcome?: "win" | "loss";
    lastDelta?: number;    // +bet or -bet
    message?: string;
    gameOver: boolean;
  }`

### Required Functions (minimum)
- `newDeck(): Card[]`  
  Creates a 52-card deck in a deterministic order.
- `shuffle(deck: Card[], rng?): Card[]`  
  Returns a shuffled copy of `deck` (Fisher–Yates). Allow optional injected RNG for tests.
- `draw(deck: Card[]): { card: Card; deck: Card[] }`  
  Draws the top card (or equivalent) from remaining deck.
- `initialState(): GameState`  
  Creates shuffled deck, draws initial current card, sets chips=3.
- `commitGuess(state: GameState, guess: "higher"|"lower", bet: number): GameState`  
  Validates inputs, draws next card, computes win/loss (tie=loss), updates chips, updates state, checks game over.

### Validations / Error Handling
- If bet invalid or guess missing, `commitGuess` must not mutate state; return state with a message or throw a controlled error (choose one approach and test it).
- If gameOver is true, commit should be a no-op.

---

## Testing Requirements
Use unit tests against the logic module.

Minimum tests:
1. `newDeck` returns 52 unique cards.
2. `shuffle` returns 52 cards, still unique, and does not mutate input array.
3. `draw` reduces deck size by 1 and returns a card not remaining in deck.
4. `commitGuess`:
   - Win case: chips increase by bet.
   - Loss case: chips decrease by bet.
   - Tie case: treated as loss.
   - Bet validation: bet > chips, bet <= 0 → rejected/no-op.
   - Deck end: when deck empty (or cannot draw next card), gameOver set true.
   - Chips end: chips reaching 0 sets gameOver true.

---

## Assets
- `public/cat.jpg` — Stan image (provided).
- Cards (v1):
  - Start with text rendering (e.g., “A♠”).
  - Optional later: add SVG/PNG card assets and map `Card -> asset`.

---

## Deployment (later)
- Must build as a static site (`npm run build` → `dist/`).
- Deploy target options: GitHub Pages / Cloudflare Pages / Netlify / Vercel.

---

## Acceptance Criteria (Definition of Done)
- User can play multiple rounds until chips == 0 or deck is exhausted.
- Betting and chip arithmetic works exactly as specified.
- Tie is always a loss.
- Remaining card count is correct and decreases on each commit.
- No card appears twice in a single game.
- Commit button disables correctly.
- Logic layer has unit tests and passes consistently.
- `New Game` resets everything deterministically (except shuffle randomness).
