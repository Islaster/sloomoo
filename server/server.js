const express = require('express');
const app = express();
require('dotenv').config();
const database = require('./database/mongodb');
const maddieRoutes = require('./routes/maddieRoute');
const slackRoutes = require('./routes/slackRoute');
const cors = require('cors');
const {Server} = require('socket.io');
const http = require('http');

const server = http.createServer(app);
const io = new Server(server);

app.set('io', io);
database();
app.use(cors());
app.use(express.json());
app.use(maddieRoutes);
app.use('/slack', slackRoutes);



const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});