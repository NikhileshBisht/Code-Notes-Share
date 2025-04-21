const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, '..', 'data.json');

router.post('/', (req, res) => {
  const { name, tabs } = req.body;

  if (!name || !Array.isArray(tabs)) {
    return res.status(400).json({ error: 'Name and tabs are required' });
  }

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

    const formattedTabs = nonEmptyTabs.map((tab, index) => ({
      id: index + 1,
      name: tab.name || `untitled ${index + 1}`,
      content: tab.content || '',
    }));

    if (existingEntry) {
      existingEntry.tabs = formattedTabs;
    } else {
      currentData.push({ name, tabs: formattedTabs });
    }

    fs.writeFile(filePath, JSON.stringify(currentData, null, 2), 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving data' });
      }
      return res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});

module.exports = router;
