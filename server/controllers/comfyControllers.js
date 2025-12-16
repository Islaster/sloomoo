const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { emitter } = require("../websockets/ws");
const { getIO } = require("../websockets/io");
const { v4 } = require("uuid");

module.exports = {
  returnLatestImageById,
  runComfy,
  updateComfyJson,
};
let queue = 0;
let latestImage;

emitter.on("img_filename", (data) => (latestImage = data));
emitter.on("status", (data) => {
  const remaining_queue = data.status.exec_info.queue_remaining;
  if (typeof remaining_queue !== "number") return;

  if (remaining_queue > queue) queue = remaining_queue;

  if (queue > remaining_queue) {
    returnLatestImageById();
  }
});

async function returnLatestImageById() {
  const io = getIO();
  const id = latestImage;

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
    const files = fs.readdirSync(process.env.DOWNLOAD_DIR);
    console.log("Filtering files...");
    // Filter files by the given ID and valid image extensions
    const latestFileArr = files.filter((file) => {
      const { name, ext } = path.parse(file);
      return name.startsWith(id) && imageExtensions.includes(ext.toLowerCase());
    });
    const latestFile = latestFileArr[0];
    console.log("latestFile: ", latestFile);
    if (latestFile.length < 1) {
      console.error("No matching files found for ID:", id);
    }

    const imagePath = path.join(process.env.DOWNLOAD_DIR, latestFile);

    console.log("serving image: ", imagePath);
    // Send the file to the client
    const filename = path.basename(imagePath);
    const publicUrl = `http://localhost:3001/comfy/${encodeURIComponent(
      filename
    )}`;
    io.emit("image_file", { url: publicUrl });
  } catch (error) {
    console.error("Error reading files:", error);
  }
}

async function runComfy(req, res) {
  try {
    const client_id = v4();
    const workflow = loadWorkflow();
    const { data } = await axios.post(
      "http://127.0.0.1:8188/prompt",
      { prompt: workflow, client_id },
      { headers: { "Content-Type": "application/json" } }
    );
    emitter.emit("client_id", data.prompt_id);
    return res.json({ ok: true, client_id, ...data });
  } catch (e) {
    const payload = e.response?.data;
    console.error(
      "[/prompt] error:",
      JSON.stringify(payload || e.message, null, 2)
    );
    return res.status(500).json({ ok: false, error: payload || e.message });
  }
}

async function updateComfyJson(req, res) {
  const { prompt, id } = req.body;
  emitter.emit("img_filename", id);
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  console.log("Received response:", req.body);

  const filePath = path.join(__dirname, "..", "workflow_api.json");

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

    try {
      console.log("requesting from deepseek...");
      // 1) Construct the JSON payload
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

      // 2) Call the Deepseek API via Axios
      const response = await axios.post(
        "https://api.deepseek.com/chat/completions",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer" + " " + process.env.DEEPSEEK_API_KEY,
          },
        }
      );

      // 3) Forward deepseek's response data to the client
      let jsonString = response.data.choices[0].message.content;
      if (jsonString.startsWith("```json")) {
        const string = jsonString.split("```")[1];
        jsonString = string
          .split("")
          .splice(4, string.length - 5)
          .join("");
      }

      // Step 2: Parse the JSON
      const jsonObject = JSON.parse(jsonString);

      // Modify JSON data
      if (jsonData["6"] && jsonData["6"].inputs) {
        jsonData["6"].inputs.text = jsonObject["flux_prompt"];
      }
      if (jsonData["9"] && jsonData["9"].inputs) {
        jsonData["9"].inputs.filename_prefix = id;
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

    console.log("emitting...");
    const io = getIO();
    io.emit("uniqueId", {
      latestImage,
      message: "Unique ID generated successfully.",
    });
  });
}

function loadWorkflow() {
  const p = path.join(__dirname, "..", "workflow_api.json");
  const txt = fs.readFileSync(p, "utf8");
  return JSON.parse(txt);
}
