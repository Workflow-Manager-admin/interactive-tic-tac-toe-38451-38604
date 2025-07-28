import React, { useState } from 'react';
import './App.css';

/**
 * Color Theme:
 *  --primary:   #2196F3
 *  --secondary: #90CAF9
 *  --accent:    #FF5252
 * Minimalistic, light, responsive Tic Tac Toe game. 
 */

// Helper to calculate winner
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns 'X', 'O', or null if no winner */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Check all winning combinations
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Represents a single cell; highlights if part of winning line */
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Square filled with ${value}` : 'Empty square'}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** 3x3 game board; highlights winning cells */
  function renderSquare(i) {
    const isWinning = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinning}
      />
    );
  }

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" role="row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function getWinningLine(squares) {
  // Returns array of square indices for the winning line, or null
  const lines = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8],
    [0, 3, 6],[1, 4, 7],[2, 5, 8],
    [0, 4, 8],[2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // X always starts; history not kept for undo/redo (simple)
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameActive, setGameActive] = useState(true);

  const winner = calculateWinner(squares);
  const winningLine = getWinningLine(squares);
  const isDraw = !winner && squares.every(Boolean);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    // Ignore click if game is over or cell is filled
    if (!gameActive || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);

    // Check for Win/Draw after move
    const nextWinner = calculateWinner(nextSquares);
    const nextDraw = !nextWinner && nextSquares.every(Boolean);
    if (nextWinner || nextDraw) setGameActive(false);
    else setXIsNext(x => !x);
  }

  // PUBLIC_INTERFACE
  function handleNewGame(firstPlayer = 'X') {
    setSquares(Array(9).fill(null));
    setXIsNext(firstPlayer === 'X');
    setGameActive(true);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    handleNewGame('X');
  }

  // Status text display
  let status;
  if (winner) {
    status = (
      <span>
        <span className="winner">{winner}</span> wins!
      </span>
    );
  } else if (isDraw) {
    status = (
      <span>
        <span className="draw">It's a draw!</span>
      </span>
    );
  } else {
    status = (
      <span>
        Next: <span className="next">{xIsNext ? 'X' : 'O'}</span>
      </span>
    );
  }

  // Responsive layout & color theme directly in CSS (see App.css)
  return (
    <div className="tic-tac-toe-app">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite">{status}</div>

        <Board squares={squares} winningLine={winningLine} onSquareClick={handleSquareClick} />

        <div className="ttt-controls">
          <button
            className="ttt-btn primary"
            onClick={() => handleNewGame('X')}
            disabled={gameActive && squares.every(sq => sq === null)}
            aria-label="Start New Game as X"
          >
            New Game (X)
          </button>
          <button
            className="ttt-btn secondary"
            onClick={() => handleNewGame('O')}
            disabled={gameActive && squares.every(sq => sq === null)}
            aria-label="Start New Game as O"
          >
            New Game (O)
          </button>
          <button
            className="ttt-btn accent"
            onClick={handleReset}
            aria-label="Reset Board"
          >
            Reset
          </button>
        </div>
        <footer className="ttt-footer">
          <span>Made with <span style={{color: '#FF5252'}}>&hearts;</span> by KAVIA • Minimalistic Tic Tac Toe</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
