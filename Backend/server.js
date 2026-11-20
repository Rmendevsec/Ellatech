// server.js
import 'dotenv/config'; // <-- MUST BE AT THE VERY TOP
import http from 'http';
import app from './src/app.js';
import { initSocket } from './src/socket.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Merkato Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
  console.log(`WebSockets are listening for connections.`);
});