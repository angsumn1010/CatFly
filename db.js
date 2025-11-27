const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',     // or your DB host
  user: 'root',
  password: 'Abhradeep1$',
  database: 'caterfly',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;