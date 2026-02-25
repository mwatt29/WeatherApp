const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite Database (creates a file called weather.db in your backend folder)
const db = new sqlite3.Database('./weather.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to the SQLite database.');
});

// Auto-create table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS weather_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    average_temperature REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// CREATE: Add new weather record
app.post('/api/weather', (req, res) => {
  const { location, startDate, endDate, temperature } = req.body;
  
  if (!location || new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ error: 'Invalid location or date range' });
  }
  
  const sql = `INSERT INTO weather_records (location, start_date, end_date, average_temperature) VALUES (?, ?, ?, ?)`;
  db.run(sql, [location, startDate, endDate, temperature], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, location, startDate, endDate, temperature });
  });
});

// READ: Get all weather records
app.get('/api/weather', (req, res) => {
  db.all('SELECT * FROM weather_records ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// UPDATE: Allow users to update weather information
app.put('/api/weather/:id', (req, res) => {
  const { id } = req.params;
  const { location, temperature } = req.body;
  
  if (!location) return res.status(400).json({ error: 'Location cannot be empty' });
  
  const sql = `UPDATE weather_records SET location = ?, average_temperature = ? WHERE id = ?`;
  db.run(sql, [location, temperature, id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update record' });
    res.json({ updated: this.changes });
  });
});

// DELETE: Allow users to delete records
app.delete('/api/weather/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM weather_records WHERE id = ?`, id, function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete record' });
    res.json({ deleted: this.changes });
  });
});

// API INTEGRATION: Fetch a YouTube video related to the location
app.get('/api/media/:location', async (req, res) => {
  const { location } = req.params;
  try {
    // Remember to replace YOUR_YOUTUBE_API_KEY with your actual key
    const ytResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${location}+city+tour&key=AIzaSyDZ1m7HnjJKIjjcUXG1NUnF1OhKQXMwFkE&maxResults=1&type=video`);
    const ytData = await ytResponse.json();
    
    if (ytData.items && ytData.items.length > 0) {
      res.json({ videoId: ytData.items[0].id.videoId });
    } else {
      res.json({ videoId: null });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// EXPORT: Export data to JSON
app.get('/api/export', (req, res) => {
  db.all('SELECT * FROM weather_records', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database export failed' });
    res.setHeader('Content-Type', 'application/json');
    res.attachment('weather_export.json');
    res.send(rows);
  });
});

app.listen(5001, () => console.log('Backend running on port 5001'));
