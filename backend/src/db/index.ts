import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql123',
    database: process.env.DB_NAME || 'event_planner_final',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
console.log('Using DB Config:', { ...dbConfig, password: '****' });

const pool = mysql.createPool(dbConfig);

export default pool;
