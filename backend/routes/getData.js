const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const note = await Note.findOne({ name });

    if (!note) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (!Array.isArray(note.tabs) || note.tabs.length === 0) {
      note.tabs = [{ id: 1, name: 'untitled 1', content: '' }];
      await note.save();
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
