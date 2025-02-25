import React from 'react';

const Grid = ({ grid, placeShip, moveShip, selectShip, selectedShip }) => {
  const getShipSymbol = (shipName) => {
    switch (shipName) {
      case 'Carrier':
        return 'C';
      case 'Battleship':
        return 'B';
      case 'Cruiser':
        return 'R';
      case 'Submarine':
        return 'S';
      case 'Destroyer':
        return 'D';
      default:
        return '';
    }
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${cell ? `ship ${cell}` : ''}`}
              onClick={() => selectedShip ? moveShip(rowIndex, cellIndex) : placeShip(rowIndex, cellIndex)}
              onDoubleClick={() => cell && selectShip(cell)}
            >
              {cell ? getShipSymbol(cell) : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid; 