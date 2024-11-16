const express = require('express');
const router = express.Router();
const maddieCtrl = require('../controllers/maddieController')

router.post('/maddie', maddieCtrl.getPrompt)

module.exports = router