const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// ⭐ Make uploaded images publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static public folder (CSS, JS, etc.)
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// mount participants routes at root so /new, /edit/:id, /api/users work
//app.use('/', require('./routes/participants'));

// mount c_events routes
app.use('/c_events', require('./routes/c_events'));

// mount certbadge routes
app.use('/certbadge', require('./routes/certbadge'));

// mount users CRUD
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
{
  console.log(`Server running on port ${PORT}`);
});