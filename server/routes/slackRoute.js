const express = require('express');
const slackController = require('../controllers/slackController');

const router = express.Router();

// Route for Slack Events API
router.post('/events', slackController.handleEvent);

module.exports = router;
