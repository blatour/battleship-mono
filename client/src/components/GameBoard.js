import React from 'react';
import './GameBoard.css';

const GameBoard = ({ grid, host, placeShip, guessLocation }) => {
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className="cell"
            onClick={() => (host ? placeShip(rowIndex, cellIndex) : guessLocation(rowIndex, cellIndex))}
          >
            {cell}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="game-board">
      {renderGrid()}
    </div>
  );
};

export default GameBoard;
