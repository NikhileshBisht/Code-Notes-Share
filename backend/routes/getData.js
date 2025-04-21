const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, '..', 'data.json');

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
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

    const matchedEntry = parsedData.find(entry => entry.name === name);

    if (!matchedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (!Array.isArray(matchedEntry.tabs) || matchedEntry.tabs.length === 0) {
      matchedEntry.tabs = [{ id: 1, name: 'untitled 1', content: '' }];
    }

    res.json(matchedEntry);
  });
});

module.exports = router;
