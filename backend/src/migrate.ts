import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const migrate = async () => {
  const DB_NAME = process.env.DB_NAME || 'event_planner_final';
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'mysql123';

  const conn = await mysql.createConnection({ host, port, user, password });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await conn.query(`USE \`${DB_NAME}\`;`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('organizer','attendee','admin') NOT NULL DEFAULT 'attendee',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizer_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        venue VARCHAR(255) NOT NULL,
        date_time DATETIME NOT NULL,
        category VARCHAR(100),
        capacity INT NOT NULL,
        ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        image_url VARCHAR(512),
        status ENUM('active','cancelled') NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        attendee_id INT NOT NULL,
        tickets_booked INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (attendee_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Migration complete');
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  } finally {
    await conn.end();
  }
};

if (require.main === module) {
  migrate().catch(() => process.exit(1));
}
