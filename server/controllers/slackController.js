const { getMyDMChannel, getLatestMessage } = require('../models/Slack');

// Fetch the latest message from the user's DM channel
const fetchLatestMessage = async (req, res) => {
  try {
    const dmChannel = await getMyDMChannel();

    if (!dmChannel) {
      return res.status(404).json({ error: 'No DM channel found' });
    }

    const latestMessage = await getLatestMessage(dmChannel.id);

    if (latestMessage) {
      return res.json({
        channel: dmChannel.id,
        message: latestMessage.text,
        timestamp: latestMessage.ts,
      });
    } else {
      return res.json({ message: 'No messages found in the channel' });
    }
  } catch (error) {
    console.error('Error in fetchLatestMessage:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { fetchLatestMessage };
