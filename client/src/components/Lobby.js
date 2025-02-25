import React, { useState } from 'react';
import './Lobby.css';
import Headers from './Headers';
import GameControls from './GameControls';
import GameBoard from './GameBoard';
import Chat from './Chat';
import Footer from './Footer';

const Lobby = ({ host, gameStarted, startGame, resetGame, grid, placeShip, guessLocation }) => {
  const [title] = useState('Welcome to the Battleship Game Lobby');
  const [subtitle] = useState('Get ready to play!');

  return (
    <div className="lobby">
      <Headers title={title} subtitle={subtitle} />
      <GameControls host={host} gameStarted={gameStarted} startGame={startGame} resetGame={resetGame} />
      <GameBoard grid={grid} host={host} placeShip={placeShip} guessLocation={guessLocation} />
      <Chat />
      <Footer />
    </div>
  );
};

export default Lobby;
