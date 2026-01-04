
import { db } from './src/config/db.config';

const checkTable = async () => {
    try {
        await db.query(`SELECT 1 FROM users LIMIT 1`);
        console.log("Users table exists.");
    } catch (err) {
        if ((err as any).code === 'ER_NO_SUCH_TABLE') {
            console.log("Users table does NOT exist. Creating...");
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
                console.log("Users table created.");

                // Seed with hashed passwords
                const bcrypt = require('bcryptjs');
                const salt = bcrypt.genSaltSync(10);
                const adminHash = bcrypt.hashSync('admin123', salt);
                const userHash = bcrypt.hashSync('user123', salt);

                await db.query(`
                    INSERT IGNORE INTO users (username, password, role) VALUES 
                    ('admin', ?, 'organizer'),
                    ('user', ?, 'attendee')
                `, [adminHash, userHash]);
                console.log("Seeded with hashed passwords.");
            } catch (e) {
                console.error("Failed to create table:", e);
            }
        } else {
            console.error("Error checking table:", err);
        }
    }
    process.exit(0);
};

checkTable();
