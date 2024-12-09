const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://sloomoo.vercel.app', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: 'https://sloomoo.vercel.app',
}));
app.use(express.json());

// Global configurations
const DOWNLOAD_DIR = path.resolve(__dirname, 'images');
const BUCKET_NAME = 'aws-output-images';
const latestVersions = {}; // In-memory tracker for file versions

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Serve images
app.get('/comfyui/output/:id', async (req, res) => {
  const { id } = req.params;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
  console.log("Request for ID:", id);

  try {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    const matchingFiles = files.filter((file) => {
      const { name, ext } = path.parse(file);
      return name.startsWith(id) && imageExtensions.includes(ext.toLowerCase());
    });

    if (matchingFiles.length === 0) {
      return res.status(404).json({ message: 'No matching images found.' });
    }

    const latestFile = matchingFiles.sort().reverse()[0];
    const imagePath = path.join(DOWNLOAD_DIR, latestFile);

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

// Poll and download files from S3
async function pollForNewFiles() {
  try {
    console.log(`Polling S3 for new files at ${new Date().toISOString()}`);
    const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const data = await s3Client.send(command);

    if (!data.Contents || data.Contents.length === 0) {
      console.log('No files found in the bucket.');
      return;
    }

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
    const validFiles = data.Contents.filter((object) => {
      const extension = path.extname(object.Key).toLowerCase();
      return imageExtensions.includes(extension);
    });

    for (const file of validFiles) {
      const parsed = parseFileName(path.basename(file.Key));
      if (!parsed) {
        console.log(`Skipping invalid file name: ${file.Key}`);
        continue;
      }

      const { id, version } = parsed;
      if (latestVersions[id] && version <= latestVersions[id]) {
        console.log(`Skipping ${file.Key}: Already processed or older version.`);
        continue;
      }

      latestVersions[id] = version;
      console.log(`New version detected: ${file.Key}`);
      await downloadFile(file.Key);
      io.emit('newImage', { id, message: "File downloaded successfully." });
    }
  } catch (error) {
    console.error('Error polling S3:', error.message);
  }

  setTimeout(pollForNewFiles, 30000); // Poll every 30 seconds
}

pollForNewFiles();

// Download a file from S3
async function downloadFile(key) {
  const localPath = path.join(DOWNLOAD_DIR, path.basename(key));
  try {
    if (!fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
      console.log(`Created directory: ${DOWNLOAD_DIR}`);
    }
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const { Body } = await s3Client.send(command);

    const fileStream = fs.createWriteStream(localPath);
    if (Body instanceof Readable) {
      Body.pipe(fileStream);
      return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
          console.log(`Downloaded: ${localPath}`);
          resolve();
        });
        fileStream.on('error', (error) => {
          console.error(`Error writing file ${key}:`, error.message);
          reject(error);
        });
      });
    }
  } catch (error) {
    console.error(`Error downloading file ${key}:`, error.message);
  }
}

// Run a Python script
app.get('/comfyui', (req, res) => {
  const pythonProcess = spawn('python3', ['comfyui-api.py']);
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Python script executed successfully!' });
    } else {
      res.status(500).json({ message: `Python script exited with code ${code}` });
    }
  });
  pythonProcess.on('error', (err) => {
    console.error('Error starting Python script:', err.message);
    res.status(500).json({ message: 'Failed to execute Python script.' });
  });
});

// Start the server
server.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

// Helper function to parse file names
function parseFileName(fileName) {
  const match = fileName.match(/^(.+)_0*(\d+)_\.\w+$/);
  if (!match) return null;
  const [_, id, version] = match;
  return { id, version: parseInt(version, 10) };
}
