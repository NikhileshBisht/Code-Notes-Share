require('dotenv').config();  // Load environment variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const getDataRoute = require('./routes/getData');
const saveNameRoute = require('./routes/saveName');
const saveDataRoute = require('./routes/saveData');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello, listening!' });
});

app.use('/api/get-data', getDataRoute);
app.use('/api/save-name', saveNameRoute);
app.use('/api/save-data', saveDataRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
