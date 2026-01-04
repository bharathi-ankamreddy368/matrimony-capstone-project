import { db } from '../config/db.config';

export const initDb = async () => {
    try {
        // Tables usually exist in the sqlite db provided.
        // specific creation logic skipped to avoid dialect issues.
        // check_db.ts handles user table creation check.
        console.log('Events and Bookings tables check skipped (using existing DB).');
    } catch (err) {
        console.error('DB init error:', err);
    }
};
