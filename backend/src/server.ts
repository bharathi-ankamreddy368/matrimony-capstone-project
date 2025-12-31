import 'dotenv/config';
import app from './app';
import { db } from './config/db.config';
import { initDb } from './setup/db.init';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => {
    try {
        // Ensure users table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'attendee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table ensured.');

        // Initialize other DB tables
        await initDb();

        // Start server
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

    } catch (err) {
        console.error('Startup Error:', err);
        process.exit(1);
    }
})();

