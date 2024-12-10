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
const { pollForNewFiles, downloadFile } = require('./watcher');
const user = {id: 1}
const crypto = require("crypto")

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://sloomoo.vercel.app', // Allow requests from your frontend
    methods: ['GET', 'POST'],
    transports: ['polling', 'websocket'],
  },
});


app.use(cors({
  origin: 'https://sloomoo.vercel.app', // Allow requests from your frontend
}))

const DOWNLOAD_DIR = path.resolve(__dirname, 'images');
const BUCKET_NAME = 'aws-output-images';

// Initialize shared `io` for all functions
pollForNewFiles(io);

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

  try {
    // Read all files in the directory
    console.log('Reading files from directory...');
    const files = fs.readdirSync(DOWNLOAD_DIR);
    
    console.log('Filtering files...');
    // Filter files by the given ID and valid image extensions
    const matchingFiles = files.filter((file) => {
      const { name, ext } = path.parse(file);
      return name.startsWith(id) && imageExtensions.includes(ext.toLowerCase());
    });

    if (matchingFiles.length === 0) {
      console.error('No matching files found for ID:', id);
      return res.status(404).json({ message: 'No matching images found.' });
    }
    console.log('Sorting files to find the latest one...');
    // Sort files to find the latest one (assuming naming convention includes versions or timestamps)
    const latestFile = matchingFiles.sort().reverse()[0]; // Sort descending and take the first file
    const imagePath = path.join(DOWNLOAD_DIR, latestFile);
    
    console.log('Generating hash...');
    const fileBuffer = fs.readFileSync(imagePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    res.setHeader('ETag', hash);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Check if this file is newer than the last served one
    if (latestServedImages[id] === latestFile) {
      return res.status(304).json({ message: 'No new images available.' }); // No new content
    }

    // Update the latest served record
    latestServedImages[id] = latestFile;
    console.log("last served image: ",latestServedImages[id])
    
    console.log('serving image: ', imagePath)
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
  user.id = uniqueId;
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
        jsonData['6'].inputs.text = `Sloomoo_Holiday_Character and ${prompt}`;
      }
     if (jsonData['9'] && jsonData['9'].inputs) {
        jsonData['9'].inputs.filename_prefix = req.body.id
      }
      console.log('prompt being sent: ', jsonData['6'].inputs.text)
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
  console.log('Server is running on https://sloomoo.onrender.com');
});
