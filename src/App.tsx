import { useState, useEffect } from "react";
import type { GameState, Guess } from "./game";
import { initialState, commitGuess } from "./game";
import { CardDisplay } from "./components/CardDisplay";
import catImage from "./assets/cat.jpg";
import "./App.css";

function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(() => initialState());
  
  // UI state for current bet and guess
  const [bet, setBet] = useState<number>(1);
  const [guess, setGuess] = useState<Guess | null>(null);

  // Reset bet/guess when game is over
  useEffect(() => {
    if (gameState.gameOver) {
      setGuess(null);
      setBet(1);
    }
  }, [gameState.gameOver]);

  // Handle new game
  const handleNewGame = () => {
    setGameState(initialState());
    setGuess(null);
    setBet(1);
  };

  // Handle bet adjustments
  const handleDecreaseBet = () => {
    setBet(Math.max(1, bet - 1));
  };

  const handleIncreaseBet = () => {
    setBet(Math.min(gameState.chips, bet + 1));
  };

  const handleHalfBet = () => {
    setBet(Math.max(1, Math.floor(gameState.chips / 2)));
  };

  const handleMaxBet = () => {
    setBet(gameState.chips);
  };

  // Handle commit button
  const handleCommit = () => {
    if (guess === null) return;
    
    const newState = commitGuess(gameState, guess, bet);
    setGameState(newState);
    
    // Don't reset guess/bet if game continues
    if (!newState.gameOver) {
      setGuess(null);
      setBet(1);
    }
  };

  // Determine if commit button should be enabled
  const canCommit =
    !gameState.gameOver &&
    guess !== null &&
    bet >= 1 &&
    bet <= gameState.chips &&
    Number.isInteger(bet);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cards with Stan</h1>
      </header>

      <main className="game-container">
        {/* Status Display */}
        <div className="status-bar">
          <div className="status-item">
            <strong>Chips:</strong> {gameState.chips}
          </div>
          <div className="status-item">
            <strong>Cards Left:</strong> {gameState.deck.length}
          </div>
        </div>

        {/* Stan's Commentary */}
        {gameState.message && (
          <div className="stan-commentary">
            <img src={catImage} alt="Stan the cat" className="stan-avatar" />
            <div className="speech-bubble">
              {gameState.message}
            </div>
          </div>
        )}

        {/* Card Display */}
        <div className="cards">
          <CardDisplay card={gameState.currentCard} label="Current Card" />
          {gameState.lastOutcome && (
            <div className="last-card-info">
              <span className={gameState.lastOutcome === "win" ? "result-win" : "result-loss"}>
                {gameState.lastOutcome === "win" ? "✓ You won!" : "✗ You lost!"}
              </span>
              <span className="chip-change">
                {" "}{gameState.lastDelta && gameState.lastDelta > 0 ? "+" : ""}
                {gameState.lastDelta} chips
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label htmlFor="bet-input">Bet Your Chips:</label>
            <div className="bet-controls">
              <div className="bet-stepper">
                <button
                  className="bet-button"
                  onClick={handleDecreaseBet}
                  disabled={gameState.gameOver || bet <= 1}
                  aria-label="Decrease bet"
                >
                  −
                </button>
                <input
                  id="bet-input"
                  type="number"
                  min={1}
                  max={gameState.chips}
                  value={bet}
                  onChange={(e) => setBet(parseInt(e.target.value) || 1)}
                  disabled={gameState.gameOver}
                  className="bet-input"
                />
                <button
                  className="bet-button"
                  onClick={handleIncreaseBet}
                  disabled={gameState.gameOver || bet >= gameState.chips}
                  aria-label="Increase bet"
                >
                  +
                </button>
              </div>
              <div className="bet-quick-buttons">
                <button
                  className="quick-bet-button"
                  onClick={handleHalfBet}
                  disabled={gameState.gameOver}
                >
                  Half: {Math.max(1, Math.floor(gameState.chips / 2))}
                </button>
                <button
                  className="quick-bet-button"
                  onClick={handleMaxBet}
                  disabled={gameState.gameOver}
                >
                  Max: {gameState.chips}
                </button>
              </div>
            </div>
          </div>

          <div className="control-group">
            <label>Guess:</label>
            <div className="guess-buttons">
              <button
                className={`guess-button lower ${guess === "lower" ? "selected" : ""}`}
                onClick={() => setGuess("lower")}
                disabled={gameState.gameOver}
              >
                ↓ Lower
              </button>
              <button
                className={`guess-button higher ${guess === "higher" ? "selected" : ""}`}
                onClick={() => setGuess("higher")}
                disabled={gameState.gameOver}
              >
                ↑ Higher
              </button>
            </div>
          </div>

          <button
            className="commit-button"
            onClick={handleCommit}
            disabled={!canCommit}
          >
            Commit
          </button>

          <button className="new-game-button" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
