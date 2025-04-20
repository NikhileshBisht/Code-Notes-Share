require('dotenv').config();  // Load environment variables from the .env file

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;  // Use the port from .env or default to 5000

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// GET endpoint to fetch data from data.json
app.get('/api/get-data', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error reading data file' });
    }

    let parsedData = [];
    if (data) {
      try {
        parsedData = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing data file' });
      }
    }

    const updatedData = parsedData.map(entry => {
      if (!Array.isArray(entry.tabs) || entry.tabs.length === 0) {
        return {
          ...entry,
          tabs: [{ id: 1, name: 'untitled 1', content: '' }]
        };
      }
      return entry;
    });

    res.json(updatedData);
  });
});

// POST endpoint to update only the 'name' field in data.json
app.post('/api/save-name', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const filePath = path.join(__dirname, 'data.json');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    let currentData = [];

    if (!err && data) {
      try {
        currentData = JSON.parse(data);
        if (!Array.isArray(currentData)) {
          currentData = [currentData];
        }
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing existing data' });
      }
    }

    const existingEntry = currentData.find(entry => entry.name === name);

    if (existingEntry) {
      return res.status(200).json({ message: 'Name already exists' });
    } else {
      currentData.push({ name: name, tabs: [] });

      fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving name to file' });
        }
        return res.status(200).json({ message: 'Name saved successfully' });
      });
    }
  });
});

// POST endpoint to save data to data.json
app.post('/api/save-data', (req, res) => {
  const { name, tabs } = req.body;

  if (!name || !Array.isArray(tabs)) {
    return res.status(400).json({ error: 'Name and tabs are required' });
  }

  const filePath = path.join(__dirname, 'data.json');
  const nonEmptyTabs = tabs.filter(tab => tab.content.trim() !== '');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    let currentData = [];

    if (!err && data) {
      try {
        currentData = JSON.parse(data);
        if (!Array.isArray(currentData)) {
          currentData = [currentData];
        }
      } catch (parseErr) {
        return res.status(500).json({ error: 'Error parsing existing data' });
      }
    }

    const existingEntry = currentData.find(entry => entry.name === name);

    if (existingEntry) {
      existingEntry.tabs = nonEmptyTabs.map((tab, index) => ({
        id: index + 1,
        name: tab.name || `untitled ${index + 1}`,
        content: tab.content || ""
      }));
    } else {
      currentData.push({
        name: name,
        tabs: nonEmptyTabs.map((tab, index) => ({
          id: index + 1,
          name: tab.name || `untitled ${index + 1}`,
          content: tab.content || ""
        }))
      });
    }

    fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving data' });
      }
      return res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
