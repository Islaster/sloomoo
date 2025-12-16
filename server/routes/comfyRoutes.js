const express = require("express");
const router = express.Router();
const comfyCtrl = require("../controllers/comfyControllers");

router.get("/comfyui", comfyCtrl.runComfy);

router.post("/", comfyCtrl.updateComfyJson);

module.exports = router;
