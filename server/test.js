const http = require('http');
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const cors = require('cors');

const server = http.createServer(); // Create a simple HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
app.use(cors());

// Handle client connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Emit a test event when a client connects
  socket.emit('testEvent', { message: 'Hello from the backend!' });

  // Listen for test events from the frontend
  socket.on('frontendTest', (data) => {
    console.log(`Received from frontend: ${data.message}`);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO test server running on http://localhost:${PORT}`);
});
