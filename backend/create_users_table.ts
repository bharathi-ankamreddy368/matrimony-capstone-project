
import bcrypt from 'bcryptjs';
import { db } from './src/config/db.config';

const seedUsers = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'attendee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table ensured.");

        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const userHash = await bcrypt.hash('user123', salt);

        await db.query(`
            INSERT IGNORE INTO users (username, password, role) VALUES 
            ('admin', ?, 'organizer'),
            ('user', ?, 'attendee')
        `, [adminHash, userHash]);
        console.log("Default users seeded (passwords hashed).");

        process.exit(0);
    } catch (err: any) {
        if (err && err.code === 'ECONNREFUSED') {
            console.error('Failed to connect to MySQL. Please ensure MySQL server is running and the DB config in .env is correct.');
            console.error('If you prefer Docker, run `npm run compose:up` in the backend folder (ensure Docker is installed).');
        } else {
            console.error(err);
        }
        process.exit(1);
    }
};

seedUsers();
