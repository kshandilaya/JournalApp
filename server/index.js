const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const JournalEntry = require('./models/JournalEntry');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create a journal entry (POST)
app.post('/entries', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newEntry = new JournalEntry({ title, content });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Get all journal entries (GET)
app.get('/entries', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 }); // Fixed here
    res.json(entries);
  } catch (error) {
    console.error("Failed to fetch entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// Get a single journal entry by ID (GET)
app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// Update a journal entry (PUT)
app.put('/entries/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete a journal entry (DELETE)
app.delete('/entries/:id', async (req, res) => {
  try {
    const deletedEntry = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
