const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de conexión leída automáticamente desde el archivo .env
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de conexiones hacia MariaDB / MySQL
const pool = mysql.createPool(dbConfig);

module.exports = {
  pool,
  dbConfig,
};
