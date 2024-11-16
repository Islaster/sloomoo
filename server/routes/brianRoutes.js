const express = require('express');
const router = express.Router();
const brianCtrl = require('../controllers/brianController');

router.post('/brian', brianCtrl.getPrompt)

module.exports = router