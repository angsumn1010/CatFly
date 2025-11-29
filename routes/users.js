const express = require('express');
const router = express.Router();
const db = require('../db');

// LIST users
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.render('users/index', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// NEW user form
router.get('/new', async (req, res) => {
  try {
    res.render('users/new');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// CREATE user
router.post('/new', async (req, res) => {
  try {
    const { name, email, phone, event_id, ent_name, password } = req.body;
    await db.execute(
      'INSERT INTO users (name, email, phone, event_id, ent_name, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, event_id || null, ent_name || null, password || null]
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
    const { name, email, phone, event_id, ent_name, password } = req.body;
    await db.execute(
      'UPDATE users SET name=?, email=?, phone=?, event_id=?, ent_name=?, password=? WHERE id=?',
      [name, email, phone || null, event_id || null, ent_name || null, password || null, req.params.id]
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