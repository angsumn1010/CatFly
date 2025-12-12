const express = require('express');
const router = express.Router();
const db = require('../db');

const fs = require('fs');
const path = require('path');
const multer = require('multer');

// ensure upload dir exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
    {
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, Date.now() + '-' + safeName);
    }
});
const upload = multer({ storage });

// LIST all certbadges
router.get('/', async (req, res) =>
{
    try
    {
        const [certbadges] = await db.query('SELECT * FROM certbadge ORDER BY id');
        res.render('certbadge/index', { certbadges });
    } catch (err)
    {
        console.error(err);
        res.status(500).send('DB error');
    }
});

// SHOW form to create
router.get('/new', (req, res) =>
{
    res.render('certbadge/new');
});

// CREATE badge
router.post('/new', async (req, res) =>
{
    try
    {
        const { badge_name, badge_description, badge_image } = req.body;
        await db.execute(
            'INSERT INTO certbadge (badge_name, badge_description, badge_image, created_at) VALUES (?, ?, ?, NOW())',
            [badge_name, badge_description || null, badge_image || null]
        );
        res.redirect('/certbadge');
    } catch (err)
    {
        console.error('certbadge create error:', err);
        res.status(500).send('Database error');
    }
});

// SHOW edit form 
router.get('/edit/:id', async (req, res) =>
{
    try
    {
        const [rows] = await db.execute('SELECT * FROM certbadge WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).send('Badge not found');
        res.render('certbadge/edit', { badge: rows[0] });
    } catch (err)
    {
        console.error(err);
        res.status(500).send('DB error');
    }
});

// UPDATE badge
router.post('/edit/:id', async (req, res) =>
{
    try
    {
        const { badge_name, badge_description, badge_image } = req.body;
        await db.execute(
            'UPDATE certbadge SET badge_name = ?, badge_description = ?, badge_image = ? WHERE id = ?',
            [badge_name, badge_description || null, badge_image || null, req.params.id]
        );
        res.redirect('/certbadge');
    } catch (err)
    {
        console.error('certbadge update error:', err);
        res.status(500).send('Database error');
    }
});

// DELETE (also remove uploaded file if present)
router.post('/delete/:id', async (req, res) =>
{
    try
    {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT badge_image FROM certbadge WHERE id = ?', [id]);
        const img = rows && rows[0] ? rows[0].badge_image : null;
        if (img && img.startsWith('/uploads/'))
        {
            const p = path.join(__dirname, '..', 'public', img.replace(/^\//, ''));
            fs.unlink(p, err =>
            {
                if (err && err.code !== 'ENOENT') console.error('Failed to remove image', err);
            });
        }
        await db.execute('DELETE FROM certbadge WHERE id = ?', [id]);
        res.redirect('/certbadge');
    } catch (err)
    {
        console.error(err);
        res.status(500).send('DB error');
    }
});

module.exports = router;