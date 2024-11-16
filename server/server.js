const express = require('express');
const app = express();
require('dotenv').config();
const database = require('./database/mongodb');
const maddieRoutes = require('./routes/maddieRoute');
const brianRoutes = require('./routes/brianRoutes');
const cors = require('cors');

database();
app.use(cors());
app.use(express.json());
app.use(maddieRoutes);
app.use(brianRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});