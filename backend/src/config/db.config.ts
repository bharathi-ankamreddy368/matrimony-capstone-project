import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const dbRequest = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql123',
    database: process.env.DB_NAME || 'event_planner_final',
    port: Number(process.env.DB_PORT) || 3306,
    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = dbRequest.promise();
