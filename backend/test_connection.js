const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
});

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
