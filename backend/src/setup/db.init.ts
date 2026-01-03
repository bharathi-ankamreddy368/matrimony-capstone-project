import { db } from '../config/db.config';

export const initDb = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                organizer_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                venue VARCHAR(255) NOT NULL,
                date_time DATETIME NOT NULL,
                category VARCHAR(100),
                capacity INT NOT NULL,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INT NOT NULL,
                attendee_id INT NOT NULL,
                tickets_booked INT NOT NULL,
                total_price DECIMAL(10,2) DEFAULT 0.00,
                qr_data LONGTEXT,
                booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            )
        `);

        console.log('Events and Bookings tables are ensured.');
    } catch (err) {
        console.error('DB init error:', err);
    }
};
