const express = require('express');
const { fetchLatestMessage } = require('../controllers/slackController');
const router = express.Router();

// Route to fetch the latest message from the user's DM channel
router.get('/', fetchLatestMessage);

module.exports = router;
