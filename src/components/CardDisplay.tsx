import type { Card as CardType } from "../game";

interface CardDisplayProps {
  card: CardType;
  label?: string;
}

/**
 * Displays a playing card with suit symbol
 */
export function CardDisplay({ card, label }: CardDisplayProps) {
  // Map suits to symbols
  const suitSymbols: Record<CardType["suit"], string> = {
    C: "♣",
    D: "♦",
    H: "♥",
    S: "♠",
  };

  // Map ranks to display strings
  const rankDisplay = (rank: number): string => {
    if (rank === 11) return "J";
    if (rank === 12) return "Q";
    if (rank === 13) return "K";
    if (rank === 14) return "A";
    return rank.toString();
  };

  // Red suits get red text
  const isRed = card.suit === "D" || card.suit === "H";

  return (
    <div className="card-display">
      {label && <div className="card-label">{label}</div>}
      <div className={`card ${isRed ? "red" : "black"}`}>
        <div className="card-rank">{rankDisplay(card.rank)}</div>
        <div className="card-suit">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  );
}
