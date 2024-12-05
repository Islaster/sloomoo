const { spawn } = require('child_process');
const Prompt = require("../models/Prompt");
const fs = require("fs");
const path = require("path");

// Path to the Python script
const pythonScript = 'comfyui-api.py';

// Path to the workflow JSON file
const workflowFilePath = path.join(__dirname, "..", "Image2Video.json");

module.exports = {
  getPrompt,
  sendPrompt,
  sendEmail,
};

async function getPrompt(req, res) {
  try {
    console.log(req.body);
    const prompt = req.body;
    const newPrompt = await Prompt.create(prompt);
    res.status(201).json(newPrompt);
    console.log(req.body);
  } catch (err) {
    res.status(500);
    console.error(err);
  }
}

async function sendEmail(req, res) {
  // Functionality for sending email (not yet implemented)
}

async function sendPrompt(req, res) {
  try {
    const { nodeId, newPrompt } = req.body; // Extract nodeId and newPrompt from the request body

    // Read the workflow JSON file
    fs.readFile(workflowFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading workflow file:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to read workflow file" });
      }

      try {
        // Parse the workflow JSON
        const workflowData = JSON.parse(data);

        // Find the target node by ID
        const targetNode = workflowData.nodes.find(
          (node) => node.id === nodeId
        );

        if (!targetNode) {
          return res
            .status(404)
            .json({ success: false, message: "Node not found" });
        }

        if (targetNode.type !== "LumaImage2Video") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid node type" });
        }

        // Update the prompt (widgets_values index 0 corresponds to the prompt)
        targetNode.widgets_values[0] = newPrompt;

        // Write the updated workflow JSON back to the file
        fs.writeFile(
          workflowFilePath,
          JSON.stringify(workflowData, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.error("Error saving updated workflow:", writeErr);
              return res
                .status(500)
                .json({ success: false, message: "Failed to save workflow" });
            }

            // Run the Python script at the end of the stack
            const pythonProcess = spawn('python3', [pythonScript]);

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

            res
              .status(200)
              .json({
                success: true,
                message: "Prompt updated successfully and Python script executed",
                updatedWorkflow: workflowData,
              });
          }
        );
      } catch (parseErr) {
        console.error("Error parsing workflow file:", parseErr);
        return res
          .status(500)
          .json({ success: false, message: "Invalid workflow file" });
      }
    });
  } catch (err) {
    console.error("Error in sendPrompt function:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
