const express = require('express');
const router = express.Router();
const db = require('../db');

// READ – List all users
app.get('/', async (req, res) => {
  const [users] = await db.query('SELECT * FROM users');
  const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
  res.render('index', { users, events });
});

// API: return users as JSON (optionally filtered by event_id)
app.get('/api/users', async (req, res) => {
  try {
    const eventId = req.query.event_id;
    let rows;
    if (eventId) {
      [rows] = await db.query('SELECT * FROM users WHERE event_id = ? ORDER BY id', [eventId]);
    } else {
      [rows] = await db.query('SELECT * FROM users ORDER BY id');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// CREATE – Show form
app.get('/new', async (req, res) => {
  const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
  res.render('new', { events });
});

// CREATE – Handle form
app.post('/new', async (req, res) => {
  const { name, email, event_id, phone, ent_name } = req.body;
  await db.execute(
    'INSERT INTO users (name, email, event_id, phone, ent_name, password) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, event_id, phone, ent_name, phone]
  );
  res.redirect('/');
});

// UPDATE – Show edit form
app.get('/edit/:id', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
  res.render('edit', { user: rows[0] });
});

// UPDATE – Handle edit form
app.post('/edit/:id', async (req, res) => {
  const { name, email, phone, ent_name } = req.body;
  await db.execute(
    'UPDATE users SET name = ?, email = ?, phone = ?, ent_name = ? WHERE id = ?',
    [name, email, phone, ent_name, req.params.id]
  );
  res.redirect('/');
});

// DELETE
app.post('/delete/:id', async (req, res) => {
  await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.redirect('/');
});

module.exports = router;
