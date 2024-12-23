const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');  
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const app = express();
const cors = require("cors");
const {spawn} = require('child_process');
const mongoose = require('mongoose')

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST'],
  },
});

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI; // Update this with your MongoDB URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for storing filenames
const imageSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true, // Allow credentials (cookies) to be sent
}))

const DOWNLOAD_DIR = path.resolve(__dirname, 'images');
const BUCKET_NAME = 'aws-output-images';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MongoDB connection string is missing from .env file.');
  process.exit(1);
}

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory tracker for the latest served file for each ID
const latestServedImages = {};

// Serve the latest image based on the given ID
app.get('/comfyui/output/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameter
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
  console.log("id: ", id);

  try {
    // Read all files in the directory
    const files = fs.readdirSync(DOWNLOAD_DIR);

    // Filter files by the given ID and valid image extensions
    const matchingFiles = files.filter((file) => {
      const { name, ext } = path.parse(file);
      return name.startsWith(id) && imageExtensions.includes(ext.toLowerCase());
    });

    if (matchingFiles.length === 0) {
      return res.status(404).json({ message: 'No matching images found.' });
    }

    // Sort files to find the latest one (assuming naming convention includes versions or timestamps)
    const latestFile = matchingFiles.sort().reverse()[0]; // Sort descending and take the first file
    const imagePath = path.join(DOWNLOAD_DIR, latestFile);

    // Check if this file is newer than the last served one
    if (latestServedImages[id] === latestFile) {
      return res.status(304).json({ message: 'No new images available.' }); // No new content
    }

    // Update the latest served record
    latestServedImages[id] = latestFile;

    // Send the file to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).json({ message: 'Error sending the image.' });
      }
    });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ message: 'Server error occurred while searching for the image.' });
  }
});

app.post('/', (req, res) => {
  const { prompt, uniqueId } = req.body;
  if (prompt) {
    console.log('Received response:', req.body);

    const filePath = './workflow_api.json';

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).json({ message: 'Failed to process request' });
      }

      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        return res.status(500).json({ message: 'Failed to process request' });
      }

      console.log('Generated unique ID:', req.body.id);

      if (jsonData['6'] && jsonData['6'].inputs) {
        jsonData['6'].inputs.text = prompt;
      }
     if (jsonData['9'] && jsonData['9'].inputs) {
        jsonData['9'].inputs.filename_prefix = req.body.id
      }

      // Write changes to the file
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to JSON file:', writeErr);
        } else {
          console.log('JSON file updated successfully');
        }
      });

      // Emit uniqueId to all connected clients
       console.log('emitting...')
      io.emit('uniqueId', { uniqueId, message: 'Unique ID generated successfully.' });

      // Respond to the client
      res.status(200).json({ message: 'Unique ID is being processed.' });
    });
  } else {
    res.status(400).json({ message: 'Prompt is required.' });
  }
});

//Run Comfyui api script
app.get("/comfyui", (req, res) => {
  const pythonScript = 'comfyui-api.py';

  // Execute the Python script
  const pythonProcess = spawn('python3', [pythonScript]);

  // On process close, send a response back
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Python script executed successfully!' });
    } else {
      res.status(500).json({ message: `Python script exited with code ${code}` });
    }
  });

  // Handle errors from spawning the process
  pythonProcess.on('error', (err) => {
    res.status(500).json({ message: 'Failed to start Python script', error: err.message });
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
