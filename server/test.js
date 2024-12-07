const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { WebClient } = require('@slack/web-api');
const app = express();
const server = http.createServer(app);
const slackToken = process.env.SLACK_BOT;
const slackClient = new WebClient(slackToken);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow your React app
        methods: ['GET', 'POST'], // Allow GET and POST requests
      },
});

app.use(express.json()); // Middleware to parse JSON request bodies

app.post('/slack/message', async (req, res) => {
  const { searchText } = req.body; // Extract searchText from the request body
  const channelId = 'D083Q1LH1UP'; // Your IM channel ID

  try {
    if (!searchText) {
      return res.status(400).send('searchText is required');
    }

    // Fetch messages from the IM channel
    const response = await slackClient.conversations.history({
      channel: channelId,
    });

    // Check if any message contains the search text
    const matchingMessages = response.messages.filter((msg) =>
      msg.text && msg.text.includes(searchText)
    );

    res.json({
      totalMessages: response.messages.length,
      matchingMessages,
    });
  } catch (error) {
    console.error('[Slack API] Error fetching messages:', error);
    res.status(500).send('Slack API Error');
  }
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
