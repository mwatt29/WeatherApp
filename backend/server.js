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

app.listen(5000, () => console.log('Backend running on port 5000'));
