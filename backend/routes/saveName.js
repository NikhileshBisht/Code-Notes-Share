const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const existing = await Note.findOne({ name });

    if (existing) {
      return res.status(200).json({ message: 'Name already exists' });
    }

    const newNote = new Note({ name, tabs: [] });
    await newNote.save();

    res.status(200).json({ message: 'Name saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving name' });
  }
});

module.exports = router;
