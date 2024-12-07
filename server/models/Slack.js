const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Fetch the DM channel with the user
const getMyDMChannel = async () => {
  try {
    const response = await slackClient.conversations.list({
      types: 'im', // Fetch DM channels
    });
    console.log("convo list", response)
    // Find the user's own DM channel
    const myChannel = response.channels.find((channel) => channel.is_im);
    console.log("my channel: ", myChannel);
    return myChannel || null;
  } catch (error) {
    console.error('Error fetching DM channels:', error);
    throw error;
  }
};

// Fetch the latest message from a given channel
const getLatestMessage = async (channelId) => {
  try {
    const response = await slackClient.conversations.history({
      channel: channelId,
      limit: 1, // Fetch only the latest message
    });
    console.log("response: ", response);
    if (response.messages && response.messages.length > 0) {
        console.log("response Message: ", response.messages);
      return response.messages[0];
    } else {
      return null; // No messages found
    }
  } catch (error) {
    console.error('Error fetching latest message:', error);
    throw error;
  }
};

module.exports = { getMyDMChannel, getLatestMessage };
