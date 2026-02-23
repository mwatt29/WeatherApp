const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  // Configure with your PostgreSQL credentials
  user: 'postgres', host: 'localhost', database: 'weather_db', password: 'password', port: 5432,
});

// CREATE: Add new weather record 
app.post('/api/weather', async (req, res) => {
  const { location, startDate, endDate, temperature } = req.body;
  try {
    // Basic validation 
    if (!location || new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Invalid location or date range' });
    }
    const result = await pool.query(
      'INSERT INTO weather_records (location, start_date, end_date, average_temperature) VALUES ($1, $2, $3, $4) RETURNING *',
      [location, startDate, endDate, temperature]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// READ: Get all weather records 
app.get('/api/weather', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weather_records ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// EXPORT: Export data to JSON/CSV 
app.get('/api/export', async (req, res) => {
    // Logic to fetch from DB and convert to CSV or pipe JSON
    const result = await pool.query('SELECT * FROM weather_records');
    res.setHeader('Content-Type', 'application/json');
    res.attachment('weather_export.json');
    res.send(result.rows);
});

// Note: UPDATE and DELETE routes would follow similar pg.query patterns 

// UPDATE: Allow users to update weather information
app.put('/api/weather/:id', async (req, res) => {
  const { id } = req.params;
  const { location, temperature } = req.body;
  try {
    if (!location) {
      return res.status(400).json({ error: 'Location cannot be empty' });
    }
    const result = await pool.query(
      'UPDATE weather_records SET location = $1, average_temperature = $2 WHERE id = $3 RETURNING *',
      [location, temperature, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// DELETE: Allow users to delete records
app.delete('/api/weather/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM weather_records WHERE id = $1', [id]);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// API INTEGRATION: Fetch a YouTube video related to the location
app.get('/api/media/:location', async (req, res) => {
  const { location } = req.params;
  try {
    // Requires a YouTube Data API v3 Key
    const ytResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${location}+city+tour&key=YOUR_YOUTUBE_API_KEY&maxResults=1&type=video`);
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

app.listen(5000, () => console.log('Backend running on port 5000'));
