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

const axios = require("axios");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { spawn } = require("child_process");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const { pollForNewFiles, downloadFile } = require("./watcher");

const app = express();
const server = http.createServer(app);

// Dynamically pick the allowed CORS origin from the environment
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [
  "http://localhost:3000", // Dev
  "https://sloomoo.vercel.app", // Prod
];
console.log("allowedOrigin: ", allowedOrigin);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    transports: ["polling", "websocket"],
  },
});

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(bodyParser.json());

const DOWNLOAD_DIR = path.resolve(__dirname, "images");
const BUCKET_NAME = "aws-output-images";

// Initialize shared `io` for all functions
pollForNewFiles(io);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// In-memory tracker for the latest served file for each ID
const latestServedImages = {};

//GET ROUTES
// Serve the latest image based on the given ID
app.get("/comfyui/output/:id", (req, res) => {
  console.log("watcher route hit.");
  const { id } = req.params; // Extract the ID from the route parameter
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
  ];

  try {
    // Read all files in the directory
    console.log("Reading files from directory...");
    const files = fs.readdirSync(DOWNLOAD_DIR);

    console.log("Filtering files...");
    // Filter files by the given ID and valid image extensions
    const matchingFiles = files.filter((file) => {
      const { name, ext } = path.parse(file);
      return name.startsWith(id) && imageExtensions.includes(ext.toLowerCase());
    });

    if (matchingFiles.length === 0) {
      console.error("No matching files found for ID:", id);
      return res.status(404).json({ message: "No matching images found." });
    }
    console.log("Sorting files to find the latest one...");
    // Sort files to find the latest one
    const latestFile = matchingFiles.sort().reverse()[0];
    const imagePath = path.join(DOWNLOAD_DIR, latestFile);

    console.log("Generating hash...");
    const fileBuffer = fs.readFileSync(imagePath);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    res.setHeader("ETag", hash);
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Check if this file is newer than the last served one
    if (latestServedImages[id] === latestFile) {
      return res.status(304).json({ message: "No new images available." }); // No new content
    }

    // Update the latest served record
    latestServedImages[id] = latestFile;
    console.log("last served image: ", latestServedImages[id]);

    console.log("serving image: ", imagePath);
    // Send the file to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).json({ message: "Error sending the image." });
      }
    });
  } catch (error) {
    console.error("Error reading files:", error);
    res.status(500).json({
      message: "Server error occurred while searching for the image.",
    });
  }
});

// Run Comfyui api script
app.get("/comfyui", (req, res) => {
  const pythonScript = "comfyui-api.py";

  // Execute the Python script
  const pythonProcess = spawn("python3", [pythonScript]);

  // On process close, send a response back
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ message: "Python script executed successfully!" });
    } else {
      res
        .status(500)
        .json({ message: `Python script exited with code ${code}` });
    }
  });

  // Handle errors from spawning the process
  pythonProcess.on("error", (err) => {
    res
      .status(500)
      .json({ message: "Failed to start Python script", error: err.message });
  });
});

//POST ROUTES
//update comfyui json
app.post("/", async (req, res) => {
  const { prompt, uniqueId } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  console.log("Received response:", req.body);

  const filePath = "./workflow_api.json";

  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).json({ message: "Failed to process request" });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return res.status(500).json({ message: "Failed to process request" });
    }

    console.log("Generated unique ID:", req.body.id);

    try {
      console.log("requesting from deepseek...");
      // 1) Construct the JSON payload (mirroring your curl -d)
      const payload = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              'Provide your response strictly in a JSON object format. Ensure the output is valid JSON and formatted as: {"poem": "example poem here", "flux_prompt": "example flux prompt here"}. Avoid any additional text outside the JSON object.',
          },
          {
            role: "system",
            content:
              "You will be provided with examples of high-quality flux prompts and poems following Sloomoo's brand guidelines. Ensure all generated prompts use magenta, cyan, and yellow colors with playful, vibrant imagery. Holiday poems should be Christmas-themed while maintaining the brand’s fun and whimsical style. Include the LoRA model for enhanced character generation with the trigger word 'Sloomoo_Holiday_character' in the flux prompt.",
          },
          {
            role: "system",
            content:
              'Examples of Flux prompts:\n\
          1. {"flux_prompt": "A bright, slime-covered landscape with glowing magenta drips and cyan skies, playful and vibrant, Sloomoo_Holiday_character."}\n\
          2. {"flux_prompt": "A magical slime galaxy, swirling with neon pink, cyan, and yellow drips, cosmic playfulness, Sloomoo_Holiday_character."}\n\
          3. {"flux_prompt": "A whimsical fantasy forest with bioluminescent plants, soft gradients of magenta, cyan, and yellow, Sloomoo_Holiday_character."}',
          },
          {
            role: "system",
            content:
              'Examples of holiday poems:\n\
        1. {"poem": "Slime bells ring, colors gleam, magenta drifts in a winter dream."}\n\
        2. {"poem": "Cyan drips like frosted cheer, yellow lights shine bright and clear."}\n\
        3. {"poem": "A swirl of joy, both bold and bright, slime sparkles warm on winter\'s night."}',
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      };

      // 2) Call the OpenAI API via Axios
      const response = await axios.post(
        "https://api.deepseek.com/chat/completions",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + process.env.CHATGPT_API_KEY,
          },
        }
      );
      console.log(response.data);
      // 3) Forward OpenAI's response data to the client
      const jsonString = response.data.choices[0].message.content
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .replace(/'/g, "")
        .trim();
      // Step 2: Parse the JSON

      const jsonObject = JSON.parse(jsonString);

      // Modify JSON data
      if (jsonData["6"] && jsonData["6"].inputs) {
        jsonData["6"].inputs.text = jsonObject["flux-prompt"];
      }
      if (jsonData["9"] && jsonData["9"].inputs) {
        jsonData["9"].inputs.filename_prefix = req.body.id;
      }

      console.log("prompt being sent: ", jsonData["6"].inputs.text);
      res.status(200).json({ poem: jsonObject.poem });
    } catch (err) {
      console.log(err);
    }

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to JSON file:", writeErr);
      } else {
        console.log("JSON file updated successfully");
      }
    });

    // Emit uniqueId to all connected clients
    console.log("emitting...");
    io.emit("uniqueId", {
      uniqueId,
      message: "Unique ID generated successfully.",
    });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(
    `Server is running on ${
      process.env.SERVER_URL || "http://localhost:" + PORT
    }`
  );
});
