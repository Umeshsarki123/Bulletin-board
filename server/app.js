const express = require('express');
const cors = require('cors');
const { getNotes, saveNotes } = require('./schema/schema');

const app = express();
app.use(cors());
app.use(express.json());


// GET all notes
app.get('/notes', (req, res) => {
  res.json(getNotes());
});


// ADD note (unique title)
app.post('/notes', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const notes = getNotes();

  if (notes.some(n => n.title.toLowerCase() === title.toLowerCase())) {
    return res.status(409).json({ error: 'Note with similar title already exists' });
  }

  const note = { id: Date.now(), title, description };
  notes.push(note);
  saveNotes(notes);

  res.json({ message: 'Note added successfully', note });
});


// UPDATE note by title
app.put('/notes/:title', (req, res) => {
  const { title: oldTitle } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const notes = getNotes();
  const index = notes.findIndex(
    n => n.title.toLowerCase() === oldTitle.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (
    notes.some(
      (n, i) => i !== index && n.title.toLowerCase() === title.toLowerCase()
    )
  ) {
    return res.status(409).json({ error: 'Another note with this title already exists' });
  }

  notes[index] = { ...notes[index], title, description };
  saveNotes(notes);

  res.json({ message: 'Note updated successfully', note: notes[index] });
});


// DELETE note by title
app.delete('/notes/:title', (req, res) => {
  const notes = getNotes();
  const index = notes.findIndex(
    n => n.title.toLowerCase() === req.params.title.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const [note] = notes.splice(index, 1);
  saveNotes(notes);

  res.json({ message: 'Note deleted successfully', note });
});


const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
