const mysql = require('mysql2');

console.log("Attempting connection to 127.0.0.1:3306...");

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    connectTimeout: 5000 // 5 seconds timeout
});

connection.connect((err) => {
    if (err) {
        console.error('CONNECTION FAILED:', err.code, err.message);
        process.exit(1);
    }
    console.log('CONNECTION SUCCESSFUL. MySQL is responding.');
    connection.end();
    process.exit(0);
});
