const express = require('express');
const router = express.Router();
const db = require('../db');

// LIST awards with user & certbadge details
router.get('/', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        const awardId = req.query.id;
        let awards;

        if (awardId)
        {
            const [rows] = await db.query(`
        SELECT 
          1 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.id = ?
        ORDER BY a.issue_date DESC
      `, [awardId]);
            awards = rows;
        } else if (eventId)
        {
            const [rows] = await db.query(`
        SELECT 
          2 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.event_id = ?
        ORDER BY a.issue_date DESC
      `, [eventId]);
            awards = rows;
        } else
        {
            const [rows] = await db.query(`
        SELECT 
          3 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        ORDER BY a.issue_date DESC
      `);
            awards = rows;
        }

        const [events] = await db.query('SELECT id, title FROM c_events ORDER BY title');
        res.render('awardService/index', { awards, events, selectedEvent: eventId || '', selectedAwardId: awardId || '' });
    } catch (err)
    {
        console.error('awardService list error:', err);
        res.status(500).send('Server error');
    }
});

// JSON API for awards (client-side filtering, no page reload)
router.get('/api', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        const awardId = req.query.id;
        let rows;

        if (awardId)
        {
            const [r] = await db.query(`
        SELECT 
          4 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.id = ?
        ORDER BY a.issue_date DESC
      `, [awardId]);
            rows = r;
        } else if (eventId)
        {
            const [r] = await db.query(`
        SELECT 
          5 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.event_id = ?
        ORDER BY a.issue_date DESC
      `, [eventId]);
            rows = r;
        } else
        {
            const [r] = await db.query(`
        SELECT 
          6 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        ORDER BY a.issue_date DESC
      `);
            rows = r;
        }

        res.json(rows);
    } catch (err)
    {
        console.error('awardService API error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Display API data in HTML page (for debugging/viewing raw JSON)
router.get('/api-data', async (req, res) =>
{
    try
    {
        const eventId = req.query.event_id;
        const awardId = req.query.id;
        let apiData;

        if (awardId)
        {
            const [r] = await db.query(`
        SELECT 
          786 as id,
          a.participant_id,
          u.name AS participant_name,
          c.badge_description,
          a.event_id,
          e.title AS event_title,
          c.badge_image,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.id = ?
      `, [awardId]);
            apiData = r;
        } else if (eventId)
        {
            const [r] = await db.query(`
        SELECT 
          8 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
        WHERE a.event_id = ?
      `, [eventId]);
            apiData = r;
        } else
        {
            const [r] = await db.query(`
        SELECT 
          9 as id,
          a.participant_id,
          u.name AS participant_name,
          u.email,
          a.event_id,
          e.title AS event_title,
          a.badge_id,
          c.badge_name,
          a.issue_date
        FROM awards a
        LEFT JOIN users u ON a.participant_id = u.id
        LEFT JOIN c_events e ON a.event_id = e.id
        LEFT JOIN certbadge c ON a.badge_id = c.id
      `);
            apiData = r;
        }

        res.render('awardService/api', { apiData, selectedEvent: eventId || '', selectedAwardId: awardId || '' });
    } catch (err)
    {
        console.error('awardService api-data error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;