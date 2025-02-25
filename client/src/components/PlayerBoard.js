import React from 'react';
import './PlayerBoard.css';

const PlayerBoard = ({ grid, placeShip }) => {
  const handleCellClick = (rowIndex, colIndex) => {
    placeShip(rowIndex, colIndex);
  };

  return (
    <div className="player-board">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${cell}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PlayerBoard;
