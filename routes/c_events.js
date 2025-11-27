const express = require('express');
const router = express.Router();
const db = require('../db');


// helper to normalize date input (array / JSON string / single string)
function normalizeDate(input) {
  if (!input) return null;
  // if input is an array already (e.g. form fields with same name)
  if (Array.isArray(input)) return input[0] || null;
  // if input is a JSON encoded array string
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed[0] || null;
  } catch (e) {
    // not JSON, continue
  }
  // otherwise return trimmed string
  return String(input).trim() || null;
}

// LIST all events
router.get('/', async (req, res) => {
  const [events] = await db.query('SELECT * FROM c_events ORDER BY id DESC');
  res.render('c_events/index', { events });
});

// SHOW form to create
router.get('/new', (req, res) => {
  res.render('c_events/new');
});

// CREATE
router.post('/new', async (req, res) => {
  const { title, description, event_date } = req.body;
  //const event_date = normalizeDate(req.body.event_date);
  await db.execute(
    'INSERT INTO c_events (title, description, event_date) VALUES (?, ?, ?)',
    [title, description, event_date]
  );
  res.redirect('/c_events');
});

// SHOW edit form
router.get('/edit/:id', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM c_events WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).send('Event not found');
  res.render('c_events/edit', { event: rows[0] });
});

//UPDATE
router.post('/edit/:id', async (req, res) => {
  const { title, description } = req.body;
  const event_date = normalizeDate(req.body.event_date);
  await db.execute(
    'UPDATE c_events SET title = ?, description = ?, event_date = ? WHERE id = ?',
    [title, description, event_date, req.params.id]
  );
  res.redirect('/c_events');
});


// DELETE
router.post('/delete/:id', async (req, res) => {
  await db.execute('DELETE FROM c_events WHERE id = ?', [req.params.id]);
  res.redirect('/c_events');
});

// SHOW single event (keep last to avoid route conflicts)
router.get('/:id', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM c_events WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).send('Event not found');
  res.render('c_events/show', { event: rows[0] });
});

module.exports = router;