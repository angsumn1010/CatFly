const express = require('express');
const router = express.Router();
const db = require('../db');

// LIST page (render view) — supports optional ?event_id for initial render
router.get('/', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        const certbadgeId = req.query.certbadge_id;
        const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
        const [certbadges] = await db.query('SELECT id, badge_name FROM certbadge ORDER BY badge_name');

        let users;
        if (eventId)
        {
            //const [rows] = await db.query('SELECT a.id,  a.name,  a.ent_name,  a.email,  a.phone, CASE WHEN b.id IS NOT NULL THEN \'Awarded\' ELSE \'Not Awarded\' END AS aa FROM users a LEFT JOIN awards b ON b.participant_id = a.id AND b.event_id = ? WHERE a.event_id = ?', [eventId, eventId]);
            const [rows] = await db.query('SELECT a.id, a.name, a.ent_name, a.email, a.phone,  c.badge_name AS badge_name,  CASE WHEN b.id IS NOT NULL THEN CONCAT(\'Awarded for \', COALESCE(c.badge_name, \'\')) ELSE \'Not Awarded\' END AS aa FROM users a LEFT JOIN awards b   ON b.participant_id = a.id AND b.event_id = ? LEFT JOIN certbadge c   ON b.badge_id = c.id WHERE a.event_id = ?', [eventId, eventId]);
            users = rows;
        } else if (certbadgeId)
        {
            //const [rows] = await db.query('SELECT id, name, ent_name, email, phone, event_id FROM users WHERE certbadge_id = ? ORDER BY id DESC', [certbadgeId]);
            //users = rows;
        } else
        {
            const [rows] = await db.query('SELECT id, name, ent_name, email, phone, event_id FROM users ORDER BY id DESC');
            users = rows;
        }

        res.render('userService/index', { users, events, certbadges, selectedEvent: eventId || '', selectedCertbadge: certbadgeId || '' });
    } catch (err)
    {
        console.error('userService list error:', err);
        res.status(500).send('Server error');
    }
});

// JSON API used by client-side dropdown (no full page reload)
// existing API route — support certbadge filter
router.get('/api', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        const certbadgeId = req.query.certbadge_id;
        let rows;
        if (eventId)
        {
            const [r] = await db.query('SELECT a.id, a.name, a.ent_name, a.email, a.phone,  c.badge_name AS badge_name,  CASE WHEN b.id IS NOT NULL THEN CONCAT(\'Awarded for \', COALESCE(c.badge_name, \'\')) ELSE \'Not Awarded\' END AS aa FROM users a LEFT JOIN awards b   ON b.participant_id = a.id AND b.event_id = ? LEFT JOIN certbadge c   ON b.badge_id = c.id WHERE a.event_id = ?', [eventId, eventId]);
            rows = r;
        } else if (certbadgeId)
        {
            //const [r] = await db.query('SELECT id, name, ent_name, email, phone, event_id FROM users WHERE certbadge_id = ? ORDER BY id DESC', [certbadgeId]);
            //rows = r;
        } else
        {
            const [r] = await db.query('SELECT id, name, ent_name, email, phone, event_id FROM users ORDER BY id DESC');
            rows = r;
        }
        res.json(rows);
    } catch (err)
    {
        console.error('userService API error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// SAVE — POST handler to insert event + certbadge selection into awards table
router.post('/save', async (req, res) =>
{
    try
    {
        const { event_id, certbadge_id } = req.body;
        await db.execute(
    `INSERT INTO awards (event_id, participant_id, badge_id, issue_date)
     SELECT ?, id, ?, CURDATE() FROM users where event_id = ?`,
    [event_id, certbadge_id, event_id]
        );
        res.redirect('/user-service?success=1');
    } catch (err)
    {
        console.error('userService save error:', err);
        res.status(500).send('Error saving to awards');
    }
});

module.exports = router;