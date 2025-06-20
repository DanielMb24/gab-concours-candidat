
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gabconcours',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

let pool;

const createConnection = async () => {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log(' Connexion à MySQL établie');
    return pool;
  } catch (error) {
    console.error(' Erreur de connexion à MySQL:', error);
    throw error;
  }
};

const getConnection = () => {
  if (!pool) {
    throw new Error('Base de données non initialisée');
  }
  return pool;
};

module.exports = {
  createConnection,
  getConnection,
  dbConfig
};
