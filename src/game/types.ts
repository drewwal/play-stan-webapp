/**
 * Type definitions for the Play Stan card game
 */

// Suit represented as single character for simplicity
export type Suit = "C" | "D" | "H" | "S"; // Clubs, Diamonds, Hearts, Spades

// Rank as number: 2-10 are face value, 11=J, 12=Q, 13=K, 14=A
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

// A playing card
export interface Card {
  suit: Suit;
  rank: Rank;
}

// Player's guess for the next card
export type Guess = "higher" | "lower";

// Outcome of a round
export type Outcome = "win" | "loss";

// Complete game state
export interface GameState {
  chips: number;              // Current chip count
  deck: Card[];               // Remaining cards to draw
  currentCard: Card;          // Card currently visible to player
  lastDrawnCard?: Card;       // Card revealed on last commit (for display)
  lastOutcome?: Outcome;      // Win or loss from last round
  lastDelta?: number;         // Chip change from last round (+bet or -bet)
  message?: string;           // Status message to display
  gameOver: boolean;          // True when game ends (chips=0 or deck empty)
}
