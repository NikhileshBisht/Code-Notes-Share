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
      currentData.push({ name, tabs: [] });

      fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error saving name to file' });
        }
        return res.status(200).json({ message: 'Name saved successfully' });
      });
    }
  });
});

module.exports = router;
