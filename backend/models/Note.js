// models/note.js
const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
  id: Number,
  name: String,
  content: String
});

const noteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tabs: [tabSchema]
});

module.exports = mongoose.model('Note', noteSchema);
