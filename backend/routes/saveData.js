const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res) => {
  const { name, tabs } = req.body;

  if (!name || !Array.isArray(tabs)) {
    return res.status(400).json({ error: 'Name and tabs are required' });
  }

  const nonEmptyTabs = tabs.filter(tab => tab.content.trim() !== '');
  const formattedTabs = nonEmptyTabs.map((tab, index) => ({
    id: index + 1,
    name: tab.name || `untitled ${index + 1}`,
    content: tab.content || '',
  }));

  try {
    let note = await Note.findOne({ name });

    if (note) {
      note.tabs = formattedTabs;
    } else {
      note = new Note({ name, tabs: formattedTabs });
    }

    await note.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

module.exports = router;
