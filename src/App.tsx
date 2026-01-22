import { useState, useEffect } from "react";
import type { GameState, Guess } from "./game";
import { initialState, commitGuess } from "./game";
import { CardDisplay } from "./components/CardDisplay";
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
        <h1>Play Stan</h1>
        <img src="/cat.jpg" alt="Stan the cat" className="stan-image" />
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

        {/* Message */}
        {gameState.message && (
          <div className={`message ${gameState.gameOver ? "game-over" : ""}`}>
            {gameState.message}
          </div>
        )}

        {/* Card Display */}
        <div className="cards">
          <CardDisplay card={gameState.currentCard} label="Current Card" />
          {gameState.lastDrawnCard && (
            <div className="last-card-info">
              <div>Last round outcome: <strong>{gameState.lastOutcome}</strong></div>
              <div>
                Chips {gameState.lastDelta && gameState.lastDelta > 0 ? "+" : ""}
                {gameState.lastDelta}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label htmlFor="bet-input">Bet:</label>
            <input
              id="bet-input"
              type="number"
              min={1}
              max={gameState.chips}
              value={bet}
              onChange={(e) => setBet(parseInt(e.target.value) || 1)}
              disabled={gameState.gameOver}
            />
          </div>

          <div className="control-group">
            <label>Guess:</label>
            <div className="guess-buttons">
              <button
                className={`guess-button ${guess === "lower" ? "selected" : ""}`}
                onClick={() => setGuess("lower")}
                disabled={gameState.gameOver}
              >
                Lower
              </button>
              <button
                className={`guess-button ${guess === "higher" ? "selected" : ""}`}
                onClick={() => setGuess("higher")}
                disabled={gameState.gameOver}
              >
                Higher
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
