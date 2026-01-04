import { db } from '../config/db.config';

(async () => {
    try {
        console.log('Dropping all tables to ensure schema sync...');
        // @ts-ignore
        await db.query('DROP TABLE IF EXISTS bookings');
        // @ts-ignore
        await db.query('DROP TABLE IF EXISTS events');
        // @ts-ignore
        await db.query('DROP TABLE IF EXISTS users');
        console.log('Tables dropped. Restart server to recreate them with new schema.');
        process.exit(0);
    } catch (err) {
        console.error('Error cleaning up:', err);
        process.exit(1);
    }
})();
