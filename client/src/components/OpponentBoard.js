import React from 'react';
import './OpponentBoard.css';

const OpponentBoard = ({ grid, guessLocation }) => {
  const handleCellClick = (rowIndex, colIndex) => {
    guessLocation(rowIndex, colIndex);
  };

  return (
    <div className="opponent-board">
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

export default OpponentBoard;
