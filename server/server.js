const fs = require("fs");
const path = require("path");
const envFile = `.env.${process.env.NODE_ENV || "dev"}`;
if (fs.existsSync(envFile)) {
  require("dotenv").config({ path: path.resolve(process.cwd(), envFile) });
  console.log(`Loaded environment from ${envFile}`);
} else {
  // fallback
  require("dotenv").config();
  console.warn(`No ${envFile} file found; using .env if available`);
}

const express = require("express");
const http = require("http");

const { initIO } = require("./websockets/io");
const { startComfyBridge } = require("./websockets/ws");
const cors = require("cors");

const bodyParser = require("body-parser");
const { pollForNewS3Files } = require("./watcher");
const comfyRoutes = require("./routes/comfyRoutes");

const app = express();
const server = http.createServer(app);

// Dynamically pick the allowed CORS origin from the environment
const allowedOrigins = [
  "http://localhost:3000", // Dev
  "https://sloomoo.vercel.app", // Prod
];

const io = initIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    transports: ["polling", "websocket"],
  },
});
startComfyBridge();
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(bodyParser.json());
if (process.env.NODE_ENV === "prod") pollForNewS3Files(io);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

if (process.env.NODE_ENV === "dev") {
  const outputDir = path.resolve(process.env.DOWNLOAD_DIR);
  console.log("[static] serving", outputDir, "at /comfy");
  app.use("/comfy", express.static(outputDir, { index: false }));
}

app.use(comfyRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(
    `Server is running on ${
      process.env.SERVER_URL || "http://localhost:" + PORT
    }`
  );
});
