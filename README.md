This Repository will be a mono-repo for a battleship game.

Summary:
- The game will be a web app that will allow users to play the game of battleship using a peer to peer connection.
- a user will start a new game and share a link with their friends.
- the first user to join the game will be the host.
- the host will be able to start the game.
- the host will be able to see the location of the other user's ships.
- the other users will not be able to see the location of the host's ships.
- the game will be played in a grid of 10x10.
- the host will place their ships on the grid and the other users will try to guess the location of the ships.
- the game will be played in a turn based manner.
- the host will go first.
- the other users will take turns guessing the location of the ships.
- the game will end when all of the ships are sunk with a prompt that the game is over, who the winner is, and the amount of time it took to win.




Architecture:

Front End:
- React

Back End:
- Node.js

Database:
- MongoDB

Server:
- Express
