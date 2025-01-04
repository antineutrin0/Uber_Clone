const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const connnectDB = require('./db/db');
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieparser());
connnectDB();

app.use('/api/user', require('./routes/user.routes'));
app.use('/api/captain', require('./routes/captain.routes'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;