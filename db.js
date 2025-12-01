const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  /*host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0*/
  host: '119.18.49.75',     // or your DB host
  user: 'aterflyc_adminUser',
  password: 'cPanelUser123@',
  database: 'aterflyc_caterfly',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;