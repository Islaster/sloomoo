let ioInstance = null;

function initIO(server, opts = {}) {
  if (ioInstance) return ioInstance;
  const { Server } = require("socket.io");
  ioInstance = new Server(server, opts);
  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("IO not initialized. Call initIO(server) first.");
  }
  return ioInstance;
}

module.exports = { initIO, getIO };
