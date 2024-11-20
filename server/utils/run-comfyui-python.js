const { spawn } = require('child_process');

// Path to your Python script
const pythonScript = '../comfyui-api.py';

// Arguments to pass to the Python script (if any)
const args = ['arg1', 'arg2'];

const pythonProcess = spawn('python3', [pythonScript, ...args]);

// Capture the output from the Python script
pythonProcess.stdout.on('data', (data) => {
  console.log(`Python Output: ${data}`);
});

// Capture errors from the Python script
pythonProcess.stderr.on('data', (data) => {
  console.error(`Python Error: ${data}`);
});

// Notify when the script is done
pythonProcess.on('close', (code) => {
  console.log(`Python script exited with code ${code}`);
});
