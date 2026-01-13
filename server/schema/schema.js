const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const FILE = path.join(dataDir, 'data.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure data file exists
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

function getNotes() {
  const data = fs.readFileSync(FILE, 'utf-8');
  return JSON.parse(data);
}

function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

module.exports = { getNotes, saveNotes };
