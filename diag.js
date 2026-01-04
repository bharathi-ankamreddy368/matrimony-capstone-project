const mysql = require('mysql2');
require('dotenv').config({ path: 'backend/.env' }); // Explicit path to ensure it loads

console.log('--- DIAGNOSTICS ---');
console.log('Current Directory:', process.cwd());
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.replace(/./g, '*') : '(empty)');
console.log('-------------------');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    port: process.env.DB_PORT || 3306
});

console.log('Attempting connection to:', connection.config.host, 'port:', connection.config.port);

connection.connect((err) => {
    if (err) {
        console.error('CONNECTION FAILED');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        process.exit(1);
    }
    console.log('CONNECTION SUCCESSFUL');
    connection.end();
});
