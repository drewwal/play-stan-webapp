import type { Card, GameState, Guess, Rank, Suit } from "./types";
import { getStanMessage } from "./stanMessages";

/**
 * Creates a new standard 52-card deck in deterministic order.
 * All 4 suits × 13 ranks.
 */
export function newDeck(): Card[] {
  const suits: Suit[] = ["C", "D", "H", "S"];
  const ranks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  
  return deck;
}

/**
 * Shuffles a deck using Fisher-Yates algorithm.
 * Returns a NEW shuffled array (does not mutate input).
 * 
 * @param deck - The deck to shuffle
 * @param rng - Optional random number generator for testing (returns 0-1)
 * @returns A new shuffled deck
 */
export function shuffle(deck: Card[], rng: () => number = Math.random): Card[] {
  const shuffled = [...deck]; // Create a copy
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Draws the top card from the deck.
 * Returns the drawn card and a NEW deck with that card removed.
 * Does NOT mutate the input deck.
 * 
 * @param deck - The deck to draw from
 * @returns Object with the drawn card and remaining deck
 * @throws Error if deck is empty
 */
export function draw(deck: Card[]): { card: Card; deck: Card[] } {
  if (deck.length === 0) {
    throw new Error("Cannot draw from empty deck");
  }
  
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  
  return { card, deck: remainingDeck };
}

/**
 * Creates the initial game state.
 * - Shuffles a fresh deck
 * - Draws the first current card
 * - Sets chips to 3
 * - No game over
 */
export function initialState(): GameState {
  const freshDeck = newDeck();
  const shuffledDeck = shuffle(freshDeck);
  const { card: currentCard, deck: remainingDeck } = draw(shuffledDeck);
  
  return {
    chips: 3,
    deck: remainingDeck,
    currentCard,
    lastDrawnCard: undefined,
    lastOutcome: undefined,
    lastDelta: undefined,
    message: getStanMessage({ outcome: "start" }),
    gameOver: false,
  };
}

/**
 * Processes a guess and bet.
 * Validates inputs, draws next card, determines win/loss, updates chips.
 * Returns a NEW game state (does not mutate input).
 * 
 * Rules:
 * - Bet must be integer between 1 and current chips (inclusive)
 * - Next card rank > current rank and guess="higher" → win
 * - Next card rank < current rank and guess="lower" → win
 * - Equal ranks → loss (tie = loss)
 * - Win: chips += bet
 * - Loss: chips -= bet
 * - Game over if chips reach 0 or no cards remain
 * 
 * @param state - Current game state
 * @param guess - "higher" or "lower"
 * @param bet - Integer bet amount
 * @returns New game state with updated values
 */
export function commitGuess(
  state: GameState,
  guess: Guess,
  bet: number
): GameState {
  // Validation: game already over
  if (state.gameOver) {
    return {
      ...state,
      message: "Game is over. Click 'New Game' to play again.",
    };
  }
  
  // Validation: bet must be an integer
  if (!Number.isInteger(bet)) {
    return {
      ...state,
      message: "Bet must be a whole number.",
    };
  }
  
  // Validation: bet range
  if (bet < 1 || bet > state.chips) {
    return {
      ...state,
      message: `Bet must be between 1 and ${state.chips}.`,
    };
  }
  
  // Validation: deck must have at least one card to draw
  if (state.deck.length === 0) {
    return {
      ...state,
      gameOver: true,
      message: "No more cards to draw. Game over!",
    };
  }
  
  // Draw the next card
  const { card: nextCard, deck: remainingDeck } = draw(state.deck);
  
  // Determine outcome
  let outcome: "win" | "loss";
  let isTie = false;
  if (nextCard.rank > state.currentCard.rank && guess === "higher") {
    outcome = "win";
  } else if (nextCard.rank < state.currentCard.rank && guess === "lower") {
    outcome = "win";
  } else {
    // Equal ranks or wrong guess → loss
    outcome = "loss";
    if (nextCard.rank === state.currentCard.rank) {
      isTie = true;
    }
  }
  
  // Calculate chip change
  const delta = outcome === "win" ? bet : -bet;
  const newChips = state.chips + delta;
  
  // Check if game over
  const gameOver = newChips <= 0 || remainingDeck.length === 0;
  
  // Get Stan's cheeky message
  let message: string;
  if (gameOver) {
    if (newChips <= 0) {
      message = getStanMessage({ outcome: "gameOver", reason: "chips" });
    } else {
      message = getStanMessage({ outcome: "gameOver", reason: "deck", chips: newChips });
    }
  } else {
    message = getStanMessage({ 
      outcome, 
      bet, 
      chips: newChips,
      reason: isTie ? "tie" : undefined 
    });
  }
  
  return {
    chips: newChips,
    deck: remainingDeck,
    currentCard: nextCard,
    lastDrawnCard: nextCard,
    lastOutcome: outcome,
    lastDelta: delta,
    message,
    gameOver,
  };
}
