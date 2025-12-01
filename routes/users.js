const express = require('express');
const router = express.Router();
const db = require('../db');

// LIST users
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users ORDER BY id DESC');
    const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
    res.render('users/index', { users, events });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

router.get('/api/users', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        let rows;
        if (eventId)
        {
            [rows] = await db.query('SELECT * FROM users WHERE event_id = ? ORDER BY id', [eventId]);
        } else
        {
            [rows] = await db.query('SELECT * FROM users ORDER BY id');
        }
        res.json(rows);
    } catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
    }
});


// NEW user form
router.get('/new', async (req, res) => {
  try {
    const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
    res.render('users/new', { events });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// CREATE user
router.post('/new', async (req, res) => {
  try {
    const { name, email, event_id, phone, ent_name } = req.body;
    await db.execute(
        'INSERT INTO users (name, email, event_id, phone, ent_name, password) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, event_id, phone, ent_name, phone]
    );
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// EDIT form
router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('User not found');
    res.render('users/edit', { user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// UPDATE
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, email, phone, ent_name } = req.body;
    await db.execute(
        'UPDATE users SET name = ?, email = ?, phone = ?, ent_name = ? WHERE id = ?',
        [name, email, phone, ent_name, req.params.id]
    );
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// DELETE
router.post('/delete/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

module.exports = router;