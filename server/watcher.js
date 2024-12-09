const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
require('dotenv').config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const { Server } = require('socket.io');
const io = new Server(3002, {
  cors: {
    origin: 'https://sloomoo.vercel.app', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

const DOWNLOAD_DIR = path.resolve(__dirname, 'images');
const BUCKET_NAME = 'aws-output-images';
const latestVersions = {}; // In-memory tracker for the latest version of each file prefix

// Extract static portion and version from the file name
function parseFileName(fileName) {
  const match = fileName.match(/^(.+)_0*(\d+)_\.\w+$/);
  if (!match) return null;
  const [_, id, version] = match;
  return { id, version: parseInt(version, 10) };
}

// Download a file from S3
async function downloadFile(key) {
  const localPath = path.join(DOWNLOAD_DIR, path.basename(key));

  try {
    if (!fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
      console.log(`Created missing directory: ${DOWNLOAD_DIR}`)
    }
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);

    const fileStream = fs.createWriteStream(localPath);
    if (Body instanceof Readable) {
      Body.pipe(fileStream);
      return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
          console.log(`Downloaded: ${localPath}`);
          resolve();
        });
        fileStream.on('error', reject);
      });
    } else {
      throw new Error('Unexpected body stream type.');
    }
  } catch (error) {
    console.error(`Error downloading file ${key}:`, error);
  }
}

// Poll the bucket for new versions
async function pollForNewFiles() {
  try {
    console.log('Checking for new files...');
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
      if (!parsed) continue;

      const { id, version } = parsed;

      // Check if the version is new
      if (!latestVersions[id] || version > latestVersions[id]) {
        // Update the tracker and download the file
        latestVersions[id] = version;
        console.log(`New version detected: ${file.Key}`);
        await downloadFile(file.Key);
        io.emit('newImage', { id, message:"file has been made" });
      } else {
        console.log(`Skipping ${file.Key}: Not a new version.`);
      }
    }
  } catch (error) {
    console.error('Error polling for new files:', error);
  }

  // Poll every 5 seconds
  setTimeout(pollForNewFiles, 5000);
}

pollForNewFiles();

io.on('connection', (socket) => {
    console.log(`Frontend connected: ${socket.id}`);
  });