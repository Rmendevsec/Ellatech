// server.js
import dotenv from 'dotenv';
import http from 'http';
import app from './src/app.js';
import { initSocket } from './src/socket.js'; // <-- Import Socket

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(` Merkato Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  console.log(` WebSockets are listening for connections.`);
});