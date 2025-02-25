import React from 'react';

const ControlPanel = ({ currentShipIndex, ships, toggleOrientation, orientation, startGame, gameStarted }) => {
  return (
    <div>
      {currentShipIndex < ships.length && (
        <div>
          <h2>Place your {ships[currentShipIndex].name}</h2>
          <button onClick={toggleOrientation}>
            Toggle Orientation ({orientation})
          </button>
        </div>
      )}
      {currentShipIndex >= ships.length && !gameStarted && (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default ControlPanel; 