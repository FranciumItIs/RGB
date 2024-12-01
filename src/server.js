const express = require('express');
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
const port = 5000; // Or any port you prefer

app.use(cors()); // VERY IMPORTANT!
app.use(bodyParser.json()); // To parse JSON requests

// PostgreSQL database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'player_performance',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully:', result.rows[0].now);
  }
});

// API endpoint to save player data
app.post('/api/players', async (req, res) => {
  const { name, points, rgb } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO players (name, points, rgb) VALUES ($1, $2, $3) RETURNING *',
      [name, points, rgb]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving player data:', error);
    res.status(500).send('Error saving player data');
  }
});

// API endpoint to get all player data
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY points DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).send('Error fetching player data');
  }
});

app.get('/api/players/names', async (req, res) => {
  const { name } = req.query; // Get the 'name' query parameter
  try {
      // Use ILIKE for case-insensitive partial matching in PostgreSQL
      const query = name ? "SELECT name FROM players WHERE name ILIKE $1 || '%'" : "SELECT name FROM players";
      const values = name ? [name] : [];
      const result = await pool.query(query, values);
      res.json(result.rows.map(row => row.name)); // Send only the names
  } catch (error) {
      console.error('Error fetching player names:', error);
      res.status(500).send('Error fetching player names');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});