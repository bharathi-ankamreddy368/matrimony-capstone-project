const mysql = require('mysql2');

const configs = [
    { host: 'localhost', port: 3306 },
    { host: '127.0.0.1', port: 3306 },
    { host: 'localhost', port: 3307 },
    { host: '127.0.0.1', port: 3307 },
    { host: 'localhost', port: 3308 },
    { host: '127.0.0.1', port: 3308 },
    { host: 'localhost', port: 33006 }, // Sometimes used by custom setups
    { host: '::1', port: 3306 } // IPv6
];

// Common credentials to try
const users = ['root', 'admin'];
const passwords = ['', 'root', 'password', '123456'];

console.log('Starting MySQL Connection Diagnostic...');
console.log('---------------------------------------');

async function testConnection(config, user, password) {
    return new Promise((resolve) => {
        const conn = mysql.createConnection({
            ...config,
            user: user,
            password: password,
            connectTimeout: 2000 // Short timeout
        });

        conn.connect((err) => {
            if (!err) {
                console.log(`✅ SUCCESS! Connected to ${config.host}:${config.port} with user: '${user}', password: '${password}'`);
                conn.end();
                resolve(true);
            } else {
                // We only care if we get ACCESS DENIED (means server exists) or SUCCESS
                if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                    console.log(`⚠️  FOUND SERVER at ${config.host}:${config.port}! (But credentials '${user}'/'${password}' were wrong)`);
                    resolve(true); // Found the server at least
                } else if (err.code !== 'ECONNREFUSED' && err.code !== 'ETIMEDOUT' && err.code !== 'ENOTFOUND') {
                    // Some other error which implies server is there but unhappy
                    console.log(`⚠️  POSSIBLE MATCH at ${config.host}:${config.port} - Error: ${err.code}`);
                    resolve(true);
                } else {
                    resolve(false);
                }
                conn.end(); // Ensure closed even on error if partially open
            }
        });
    });
}

(async () => {
    let serverFound = false;

    for (const config of configs) {
        // Try with default root/empty first as it's most common for XAMPP
        const success = await testConnection(config, 'root', '');
        if (success) {
            serverFound = true;
            // If we connected with root/'', we are done. If we got access denied, we might want to try other passwords?
            // For now, identifying the PORT is the main victory.
        } else {
            // If root/'' failed with ECONNREFUSED, scanning other passwords won't help on the **same port**.
            // But if we want to be thorough about "Access Denied" logic, we just need to know if the PORT is open.
            // The first testConnection checks connectivity. ECONNREFUSED means nothing is there.
        }
    }

    if (!serverFound) {
        console.log('---------------------------------------');
        console.log('❌ Could not find ANY active MySQL server on ports 3306, 3307, 3308.');
        console.log('Please verify your MySQL service is actually STARTING.');
    } else {
        console.log('---------------------------------------');
        console.log('Scan complete.');
    }
})();
