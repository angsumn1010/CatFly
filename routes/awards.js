const express = require('express');
const router = express.Router();
const db = require('../db');
// LIST awards
router.get('/', async (req, res) =>
{
  try
  {
    const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
    const [awards] = await db.query('SELECT * FROM users ORDER BY id DESC');
    res.render('awards/index', { awards, events });
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// NEW award form
router.get('/new', async (req, res) =>
{
  try
  {
    res.render('awards/new');
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Error');
  }
});

// CREATE award
router.post('/new', async (req, res) =>
{
  try
  {
    const { award_name, award_type, description } = req.body;
    await db.execute(
      'INSERT INTO awards (award_name, award_type, description) VALUES (?, ?, ?)',
      [award_name, award_type || null, description || null]
    );
    res.redirect('/awards');
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// EDIT form
router.get('/edit/:id', async (req, res) =>
{
  try
  {
    const [rows] = await db.execute('SELECT * FROM awards WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Award not found');
    res.render('awards/edit', { award: rows[0] });
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// UPDATE award
router.post('/edit/:id', async (req, res) =>
{
  try
  {
    const { award_name, award_type, description } = req.body;
    await db.execute(
      'UPDATE awards SET award_name=?, award_type=?, description=? WHERE id=?',
      [award_name, award_type || null, description || null, req.params.id]
    );
    res.redirect('/awards');
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// DELETE award
router.post('/delete/:id', async (req, res) =>
{
  try
  {
    await db.execute('DELETE FROM awards WHERE id = ?', [req.params.id]);
    res.redirect('/awards');
  } catch (err)
  {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// JSON API for awards
router.get('/api/awards', async (req, res) =>
{
  try
  {
    const [awards] = await db.query('SELECT id, award_name, award_type FROM awards ORDER BY award_name');
    res.json(awards);
  } catch (err)
  {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
