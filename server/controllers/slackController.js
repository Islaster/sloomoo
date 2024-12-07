module.exports = {
    handleEvent,
  };
  

function handleEvent (req, res){
    const { type, challenge, event } = req.body;
  
    if (type === 'url_verification') {
      return res.json({ challenge });
    }
  
    if (type === 'event_callback' && event.type === 'message') {
      const io = req.app.get('io'); // Access the WebSocket server
      io.emit('newMessage', event); // Notify clients about the new message
      console.log(`New message broadcasted: ${event.text}`);
      return res.sendStatus(200);
    }
  
    res.sendStatus(400);
  };
  