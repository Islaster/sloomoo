const express = require('express');
const router = express.Router();
const maddieCtrl = require('../controllers/maddieController')

router.post('/maddie', maddieCtrl.getPrompt);
router.post("/sendPrompt", maddieCtrl.sendPrompt);

module.exports = router