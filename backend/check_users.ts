import pool from './src/db';

async function checkUsers() {
    try {
        const [rows] = await pool.query('SELECT id, username, role FROM users');
        console.log('Current Users in DB:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error fetching users:', err);
        process.exit(1);
    }
}

checkUsers();
