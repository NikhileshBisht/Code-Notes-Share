require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Path to data.json — consistent across all endpoints
const dataFilePath = path.join(__dirname, '..', 'data.json');

// Enable CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// 🔹 POST /api/get-data — Fetch data by name
app.post('/api/get-data', (req, res) => {
  const { name } = req.body;
  console.log("Requested name:", name);

  fs.readFile(dataFilePath, 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error reading data file' });
    }

    let parsedData = [];
    if (data) {
      try {
        parsedData = JSON.parse(data);
        console.log("Parsed data:", parsedData);
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing data file' });
      }
    }

    const matchedEntry = parsedData.find(entry => entry.name.toString() === name.toString());
    console.log("Matched entry:", matchedEntry);
    console.log("All names in data:", parsedData.map(e => e.name));

    if (!matchedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (!Array.isArray(matchedEntry.tabs) || matchedEntry.tabs.length === 0) {
      matchedEntry.tabs = [{ id: 1, name: 'untitled 1', content: '' }];
    }

    res.json(matchedEntry);
  });
});

// 🔹 POST /api/save-name — Add a new name if it doesn’t exist
app.post('/api/save-name', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  fs.readFile(dataFilePath, 'utf-8', (err, data) => {
    let currentData = [];

    if (!err && data) {
      try {
        currentData = JSON.parse(data);
        if (!Array.isArray(currentData)) currentData = [currentData];
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing existing data' });
      }
    }

    const existingEntry = currentData.find(entry => entry.name === name);
    if (existingEntry) {
      return res.status(200).json({ message: 'Name already exists' });
    }

    currentData.push({ name, tabs: [] });

    fs.writeFile(dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving name to file' });
      }
      res.status(200).json({ message: 'Name saved successfully' });
    });
  });
});

// 🔹 POST /api/save-data — Save or update tabs for a name
app.post('/api/save-data', (req, res) => {
  const { name, tabs } = req.body;

  if (!name || !Array.isArray(tabs)) {
    return res.status(400).json({ error: 'Name and tabs are required' });
  }

  const nonEmptyTabs = tabs.filter(tab => tab.content.trim() !== '');

  fs.readFile(dataFilePath, 'utf-8', (err, data) => {
    let currentData = [];

    if (!err && data) {
      try {
        currentData = JSON.parse(data);
        if (!Array.isArray(currentData)) currentData = [currentData];
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing existing data' });
      }
    }

    const existingEntry = currentData.find(entry => entry.name === name);
    const updatedTabs = nonEmptyTabs.map((tab, index) => ({
      id: index + 1,
      name: tab.name || `untitled ${index + 1}`,
      content: tab.content || ""
    }));

    if (existingEntry) {
      existingEntry.tabs = updatedTabs;
    } else {
      currentData.push({ name, tabs: updatedTabs });
    }

    fs.writeFile(dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving data' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
