import { describe, it, expect } from "vitest";
import { newDeck, shuffle, draw, initialState, commitGuess } from "./game";
import { getStanMessage } from "./stanMessages";
import type { Card } from "./types";

describe("newDeck", () => {
  it("should return 52 unique cards", () => {
    const deck = newDeck();
    expect(deck.length).toBe(52);

    // Check uniqueness - convert to strings and use Set
    const cardStrings = deck.map((c) => `${c.rank}-${c.suit}`);
    const uniqueCards = new Set(cardStrings);
    expect(uniqueCards.size).toBe(52);
  });

  it("should have all ranks and suits", () => {
    const deck = newDeck();
    const suits = new Set(deck.map((c) => c.suit));
    const ranks = new Set(deck.map((c) => c.rank));

    expect(suits.size).toBe(4);
    expect(ranks.size).toBe(13);
  });
});

describe("shuffle", () => {
  it("should return 52 cards", () => {
    const deck = newDeck();
    const shuffled = shuffle(deck);
    expect(shuffled.length).toBe(52);
  });

  it("should still have all unique cards", () => {
    const deck = newDeck();
    const shuffled = shuffle(deck);

    const cardStrings = shuffled.map((c) => `${c.rank}-${c.suit}`);
    const uniqueCards = new Set(cardStrings);
    expect(uniqueCards.size).toBe(52);
  });

  it("should not mutate input array", () => {
    const deck = newDeck();
    const original = [...deck];
    shuffle(deck);

    expect(deck).toEqual(original);
  });

  it("should use provided RNG function", () => {
    const deck = newDeck();
    // RNG that always returns 0.5 - predictable but still random-ish
    const fixedRng = () => 0.5;
    const shuffled1 = shuffle(deck, fixedRng);
    const shuffled2 = shuffle(deck, fixedRng);

    expect(shuffled1).toEqual(shuffled2); // Same RNG = same result
  });
});

describe("draw", () => {
  it("should reduce deck size by 1", () => {
    const deck = newDeck();
    const { deck: remaining } = draw(deck);
    expect(remaining.length).toBe(51);
  });

  it("should return a card not in the remaining deck", () => {
    const deck = newDeck();
    const { card, deck: remaining } = draw(deck);

    const hasCard = remaining.some(
      (c) => c.rank === card.rank && c.suit === card.suit
    );
    expect(hasCard).toBe(false);
  });

  it("should not mutate input deck", () => {
    const deck = newDeck();
    const original = [...deck];
    draw(deck);

    expect(deck).toEqual(original);
  });

  it("should throw error when drawing from empty deck", () => {
    const emptyDeck: Card[] = [];
    expect(() => draw(emptyDeck)).toThrow("Cannot draw from empty deck");
  });
});

describe("initialState", () => {
  it("should have 3 starting chips", () => {
    const state = initialState();
    expect(state.chips).toBe(3);
  });

  it("should have 51 cards remaining (after drawing current card)", () => {
    const state = initialState();
    expect(state.deck.length).toBe(51);
  });

  it("should have a current card", () => {
    const state = initialState();
    expect(state.currentCard).toBeDefined();
    expect(state.currentCard.rank).toBeGreaterThanOrEqual(2);
    expect(state.currentCard.rank).toBeLessThanOrEqual(14);
  });

  it("should not be game over", () => {
    const state = initialState();
    expect(state.gameOver).toBe(false);
  });

  it("should have a welcome message", () => {
    const state = initialState();
    expect(state.message).toBeTruthy();
  });
});

describe("commitGuess", () => {
  describe("validation", () => {
    it("should reject non-integer bets", () => {
      const state = initialState();
      const result = commitGuess(state, "higher", 2.5);
      expect(result.message).toContain("whole number");
      expect(result.chips).toBe(state.chips); // No change
    });

    it("should reject bet greater than chips", () => {
      const state = initialState();
      const result = commitGuess(state, "higher", 10);
      expect(result.message).toContain("between 1 and");
      expect(result.chips).toBe(state.chips);
    });

    it("should reject bet less than 1", () => {
      const state = initialState();
      const result = commitGuess(state, "higher", 0);
      expect(result.message).toContain("between 1 and");
      expect(result.chips).toBe(state.chips);
    });

    it("should be no-op if game is already over", () => {
      const state = { ...initialState(), gameOver: true };
      const result = commitGuess(state, "higher", 1);
      expect(result.message).toContain("Game is over");
    });
  });

  describe("win scenarios", () => {
    it("should increase chips by bet amount on win", () => {
      // Create a state where we know the outcome
      // Current card is 2, next card will be higher
      const state: any = {
        ...initialState(),
        currentCard: { rank: 2, suit: "C" },
        deck: [
          { rank: 10, suit: "D" },
          ...newDeck().slice(2),
        ],
      };

      const result = commitGuess(state, "higher", 2);
      expect(result.chips).toBe(5); // 3 + 2
      expect(result.lastOutcome).toBe("win");
      expect(result.lastDelta).toBe(2);
    });

    it("should work for 'lower' guess", () => {
      const state: any = {
        ...initialState(),
        currentCard: { rank: 14, suit: "C" }, // Ace
        deck: [
          { rank: 2, suit: "D" },
          ...newDeck().slice(2),
        ],
      };

      const result = commitGuess(state, "lower", 1);
      expect(result.chips).toBe(4); // 3 + 1
      expect(result.lastOutcome).toBe("win");
    });
  });

  describe("loss scenarios", () => {
    it("should decrease chips by bet amount on loss", () => {
      const state: any = {
        ...initialState(),
        currentCard: { rank: 10, suit: "C" },
        deck: [
          { rank: 2, suit: "D" },
          ...newDeck().slice(2),
        ],
      };

      const result = commitGuess(state, "higher", 2);
      expect(result.chips).toBe(1); // 3 - 2
      expect(result.lastOutcome).toBe("loss");
      expect(result.lastDelta).toBe(-2);
    });

    it("should treat tie (equal ranks) as loss", () => {
      const state: any = {
        ...initialState(),
        currentCard: { rank: 7, suit: "C" },
        deck: [
          { rank: 7, suit: "D" }, // Same rank, different suit
          ...newDeck().slice(2),
        ],
      };

      const result = commitGuess(state, "higher", 1);
      expect(result.chips).toBe(2); // 3 - 1
      expect(result.lastOutcome).toBe("loss");
    });
  });

  describe("game over conditions", () => {
    it("should set gameOver when chips reach 0", () => {
      const state: any = {
        ...initialState(),
        chips: 1,
        currentCard: { rank: 10, suit: "C" },
        deck: [
          { rank: 2, suit: "D" },
          ...newDeck().slice(2),
        ],
      };

      const result = commitGuess(state, "higher", 1);
      expect(result.chips).toBe(0);
      expect(result.gameOver).toBe(true);
      expect(result.message).toBeTruthy();
    });

    it("should set gameOver when deck is exhausted", () => {
      const state: any = {
        ...initialState(),
        currentCard: { rank: 5, suit: "C" },
        deck: [{ rank: 10, suit: "D" }], // Only one card left
      };

      const result = commitGuess(state, "higher", 1);
      expect(result.gameOver).toBe(true);
      expect(result.deck.length).toBe(0);
      expect(result.message).toBeTruthy();
    });

    it("should reject commit when deck is empty before draw", () => {
      const state: any = {
        ...initialState(),
        deck: [], // Empty deck
      };

      const result = commitGuess(state, "higher", 1);
      expect(result.gameOver).toBe(true);
      expect(result.chips).toBe(state.chips); // No change
    });
  });

  describe("state updates", () => {
    it("should update current card to the drawn card", () => {
      const state: any = {
        ...initialState(),
        currentCard: { rank: 5, suit: "C" },
        deck: [
          { rank: 10, suit: "D" },
          { rank: 3, suit: "H" },
        ],
      };

      const result = commitGuess(state, "higher", 1);
      expect(result.currentCard).toEqual({ rank: 10, suit: "D" });
    });

    it("should reduce deck by one card", () => {
      const state = initialState();
      const originalDeckSize = state.deck.length;

      const result = commitGuess(state, "higher", 1);
      expect(result.deck.length).toBe(originalDeckSize - 1);
    });

    it("should not mutate original state", () => {
      const state = initialState();
      const originalChips = state.chips;
      const originalDeckLength = state.deck.length;

      commitGuess(state, "higher", 1);

      expect(state.chips).toBe(originalChips);
      expect(state.deck.length).toBe(originalDeckLength);
    });
  });
});

describe("getStanMessage", () => {
  it("should return a string for start outcome", () => {
    const message = getStanMessage({ outcome: "start" });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a string for win outcome", () => {
    const message = getStanMessage({ outcome: "win", bet: 2, chips: 5 });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a string for loss outcome", () => {
    const message = getStanMessage({ outcome: "loss", bet: 1, chips: 2 });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a string for tie loss", () => {
    const message = getStanMessage({ outcome: "loss", bet: 1, chips: 2, reason: "tie" });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a string for game over by chips", () => {
    const message = getStanMessage({ outcome: "gameOver", reason: "chips" });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a string for game over by deck", () => {
    const message = getStanMessage({ outcome: "gameOver", reason: "deck", chips: 10 });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
  });

  it("should return a high score message", () => {
    const message = getStanMessage({ outcome: "gameOver", reason: "highScore", chips: 15 });
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
    expect(message).toContain("🏆");
  });
});
