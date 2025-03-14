const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost', // or your MySQL server host
  user: 'test',
  password: 'test',
  database: 'battleship'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Example table creation (run this once to set up your table)
db.query(`
  CREATE TABLE IF NOT EXISTS game_state (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gameId VARCHAR(255) UNIQUE,
    host BOOLEAN,
    gameStarted BOOLEAN,
    grid JSON,
    ships JSON,
    turn VARCHAR(255),
    winner VARCHAR(255)
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  }
});

// API endpoint to get the game state
app.get('/api/game-state', (req, res) => {
  db.query('SELECT * FROM game_state LIMIT 1', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// API endpoint to update the game state
app.post('/api/game-state', (req, res) => {
  const { host, gameStarted, grid, ships, turn, winner } = req.body;
  console.log('Received game state:', req.body); // Log the received data
  db.query(
    'INSERT INTO game_state (host, gameStarted, grid, ships, turn, winner) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE host=?, gameStarted=?, grid=?, ships=?, turn=?, winner=?',
    [host, gameStarted, JSON.stringify(grid), JSON.stringify(ships), turn, winner, host, gameStarted, JSON.stringify(grid), JSON.stringify(ships), turn, winner],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send(err);
      } else {
        console.log('Game state updated:', results);
        res.json({ success: true });
      }
    }
  );
});

// Example route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let games = {};

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    switch (data.type) {
      case 'createGame':
        console.log('Creating a new game on the server...');
        const gameId = Math.random().toString(36).substring(2, 15);
        games[gameId] = { players: [ws], state: 'waiting', turn: 'host', grid: Array(10).fill(Array(10).fill(null)) };
        ws.send(JSON.stringify({ type: 'gameCreated', gameId }));
        break;
      case 'joinGame':
        const game = games[data.gameId];
        if (game && game.players.length < 2) {
          game.players.push(ws);
          game.state = 'ready';
          game.players.forEach((player) => player.send(JSON.stringify({ type: 'gameReady', turn: game.turn })));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Game not found or full' }));
        }
        break;
      case 'makeMove':
        const currentGame = games[data.gameId];
        if (currentGame && currentGame.turn === data.player) {
          const { x, y } = data.move;
          currentGame.grid[x][y] = data.player === 'host' ? 'X' : 'O';
          currentGame.turn = currentGame.turn === 'host' ? 'guest' : 'host';
          currentGame.players.forEach((player) => player.send(JSON.stringify({ type: 'updateGame', grid: currentGame.grid, turn: currentGame.turn })));
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

app.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});
