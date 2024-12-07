const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Set up Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with specific origin in production
    methods: ['GET', 'POST'],
  },
});

// Slack API setup
const slackToken = process.env.SLACK_BOT;
const slackClient = new WebClient(slackToken);

// Store the last message timestamp for each channel
const lastMessageTimestamps = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Listen for the "watchSlack" event to start polling
  socket.on('watchSlack', async () => {
    console.log(`[Socket.io] 'watchSlack' event received from client: ${socket.id}`);

    try {
      // Fetch DM channels from Slack
      const dmChannelsResponse = await slackClient.conversations.list({
        types: 'im',
      });

      const dmChannels = dmChannelsResponse.channels;

      console.log(`[Polling] DM channels fetched:`, dmChannels);

      // Start polling for new messages
      const pollInterval = setInterval(async () => {
        for (const channel of dmChannels) {
          // Skip Slackbot channel
          if (channel.user === 'USLACKBOT') {
            console.log(`[Polling] Skipping Slackbot channel: ${channel.id}`);
            continue;
          }

          try {
            console.log(`[Polling] Fetching messages for channel: ${channel.id}`);
            const historyResponse = await slackClient.conversations.history({
              channel: channel.id,
              limit: 1, // Only fetch the latest message
            });

            if (historyResponse.messages && historyResponse.messages.length > 0) {
              const latestMessage = historyResponse.messages[0];

              // Check if it's a new message
              if (
                !lastMessageTimestamps[channel.id] ||
                latestMessage.ts > lastMessageTimestamps[channel.id]
              ) {
                lastMessageTimestamps[channel.id] = latestMessage.ts;

                console.log(`[Socket.io] Emitting new message for channel ${channel.id}:`, latestMessage);

                // Emit the new message to the client
                socket.emit('newMessage', {
                  channel: channel.id,
                  user: latestMessage.user,
                  text: latestMessage.text,
                  timestamp: latestMessage.ts,
                });
              } else {
                console.log(`[Polling] No new messages for channel ${channel.id}`);
              }
            } else {
              console.log(`[Polling] No messages found for channel ${channel.id}`);
            }
          } catch (error) {
            console.error(`[Slack API] Error fetching messages for channel ${channel.id}:`, error);
          }
        }
      }, 5000); // Poll every 5 seconds

      // Clear the interval if the client disconnects
      socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
        clearInterval(pollInterval);
      });
    } catch (error) {
      console.error(`[Slack API] Error fetching DM channels:`, error);
      socket.emit('error', { message: 'Failed to fetch Slack DM channels' });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
