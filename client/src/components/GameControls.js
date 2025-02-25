import React from 'react';
import './GameControls.css';

const GameControls = ({ host, gameStarted, startGame, resetGame }) => {
  return (
    <div className="game-controls">
      {!gameStarted && host && (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      )}
      {gameStarted && (
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      )}
    </div>
  );
};

export default GameControls;
