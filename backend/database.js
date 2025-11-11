import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const pool = mysql.createPool({
   host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
   ssl: {
      // Aiven requires an SSL connection
      rejectUnauthorized: false,
    }
});

const db = pool.promise(); // Enables async/await
export default db;
