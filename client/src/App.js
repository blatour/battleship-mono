import React, { useState, useEffect } from 'react';
import './styles/styles.css';
import Grid from './components/Grid';
import ControlPanel from './components/ControlPanel';

const GRID_SIZE = 10;
const SHIPS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];

const App = () => {
  const [host, setHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
  const [ships, setShips] = useState([]);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState('horizontal');
  const [selectedShip, setSelectedShip] = useState(null);
  const [turn, setTurn] = useState('host');
  const [winner, setWinner] = useState(null);
  const [ws, setWs] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState('menu');

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8080');
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleMessage = (data) => {
    switch (data.type) {
      case 'gameCreated':
        setGameId(data.gameId);
        setHost(true);
        setGameState('placingShips');
        break;
      case 'gameReady':
        setGameState('ready');
        setTurn(data.turn);
        break;
      case 'updateGame':
        setGrid(data.grid);
        setTurn(data.turn);
        break;
      case 'error':
        alert(data.message);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const createGame = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Creating a new game...');
      ws.send(JSON.stringify({ type: 'createGame' }));
    } else {
      console.error('WebSocket is not open. Current state:', ws?.readyState);
    }
  };

  const joinGame = (id) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'joinGame', gameId: id }));
    } else {
      console.error('WebSocket is not open');
    }
  };

  const startGame = () => {
    if (currentShipIndex >= SHIPS.length) {
      setGameStarted(true);
      setGameState('playing');
      console.log('Game started');
    } else {
      console.log('Please place all ships before starting the game');
    }
  };

  const toggleOrientation = () => {
    setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal');
    console.log(`Orientation toggled to ${orientation}`);
  };

  const placeShip = (x, y) => {
    if (host && currentShipIndex < SHIPS.length) {
      const ship = SHIPS[currentShipIndex];
      const newGrid = grid.map(row => [...row]);
      const newShips = [...ships];

      let canPlace = true;
      for (let i = 0; i < ship.size; i++) {
        const newX = orientation === 'horizontal' ? x : x + i;
        const newY = orientation === 'horizontal' ? y + i : y;
        if (newX >= GRID_SIZE || newY >= GRID_SIZE || newGrid[newX][newY] !== null) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < ship.size; i++) {
          const newX = orientation === 'horizontal' ? x : x + i;
          const newY = orientation === 'horizontal' ? y + i : y;
          newGrid[newX][newY] = ship.name;
        }
        newShips.push({ ...ship, x, y, orientation });
        setGrid(newGrid);
        setShips(newShips);
        setCurrentShipIndex(currentShipIndex + 1);
      }
    }
  };

  const selectShip = (shipName) => {
    const ship = ships.find(s => s.name === shipName);
    if (ship) {
      setSelectedShip(ship);
      console.log(`Selected ship: ${ship.name}`);
    }
  };

  const moveShip = (x, y) => {
    if (selectedShip) {
      console.log(`Moving ship ${selectedShip.name} to (${x}, ${y})`);
      const newGrid = grid.map(row => [...row]);

      for (let i = 0; i < selectedShip.size; i++) {
        const oldX = selectedShip.orientation === 'horizontal' ? selectedShip.x : selectedShip.x + i;
        const oldY = selectedShip.orientation === 'horizontal' ? selectedShip.y + i : selectedShip.y;
        newGrid[oldX][oldY] = null;
      }

      let canMove = true;
      for (let i = 0; i < selectedShip.size; i++) {
        const newX = selectedShip.orientation === 'horizontal' ? x : x + i;
        const newY = selectedShip.orientation === 'horizontal' ? y + i : y;
        if (newX >= GRID_SIZE || newY >= GRID_SIZE || newGrid[newX][newY] !== null) {
          canMove = false;
          console.log(`Cannot move ${selectedShip.name} to (${newX}, ${newY}) - Out of bounds or occupied`);
          break;
        }
      }

      if (canMove) {
        for (let i = 0; i < selectedShip.size; i++) {
          const newX = selectedShip.orientation === 'horizontal' ? x : x + i;
          const newY = selectedShip.orientation === 'horizontal' ? y + i : y;
          newGrid[newX][newY] = selectedShip.name;
        }
        setGrid(newGrid);
        setShips(ships.map(s => s.name === selectedShip.name ? { ...s, x, y } : s));
        setSelectedShip(null);
        console.log(`Moved ${selectedShip.name} to (${x}, ${y})`);
      } else {
        console.log('Cannot move ship here');
      }
    }
  };

  const makeMove = (x, y) => {
    if (ws && ws.readyState === WebSocket.OPEN && turn === (host ? 'host' : 'guest')) {
      ws.send(JSON.stringify({ type: 'makeMove', gameId, player: host ? 'host' : 'guest', move: { x, y } }));
    } else {
      console.error('Not your turn or WebSocket is not open');
    }
  };

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      {gameState === 'menu' && (
        <div>
          <button onClick={createGame} disabled={ws?.readyState !== WebSocket.OPEN}>Start a New Game</button>
          <input type="text" placeholder="Enter Game ID" onBlur={(e) => joinGame(e.target.value)} />
        </div>
      )}
      {gameId && <h2>Your Game ID: {gameId}</h2>}
      {gameState === 'placingShips' && (
        <div>
          <h2>Place your ships</h2>
          <Grid
            grid={grid}
            placeShip={placeShip}
            selectedShip={selectedShip}
          />
          <ControlPanel
            currentShipIndex={currentShipIndex}
            ships={SHIPS}
            toggleOrientation={toggleOrientation}
            orientation={orientation}
            startGame={startGame}
            gameStarted={gameStarted}
          />
        </div>
      )}
      {gameState === 'ready' && <h2>Game Ready! {turn === (host ? 'host' : 'guest') ? 'Your turn' : 'Opponent\'s turn'}</h2>}
      {gameState === 'playing' && (
        <div>
          <Grid
            grid={grid}
            makeMove={makeMove}
            selectedShip={selectedShip}
          />
        </div>
      )}
      {winner && <h2>{winner} wins!</h2>}
    </div>
  );
};

export default App;

