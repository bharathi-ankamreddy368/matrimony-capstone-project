const mysql = require('mysql2');

console.log('Testing XAMPP MySQL connection...\n');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    connectTimeout: 5000
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection FAILED');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('\nTry these fixes:');
        console.error('1. In XAMPP, click Config > my.ini next to MySQL');
        console.error('2. Find and uncomment: skip-networking');
        console.error('3. Change it to: # skip-networking (commented out)');
        console.error('4. Save and restart MySQL in XAMPP');
        process.exit(1);
    }
    console.log('✅ Connection SUCCESSFUL!');
    console.log('MySQL is working correctly with Node.js\n');
    console.log('Now run: npm run migrate');
    connection.end();
});
