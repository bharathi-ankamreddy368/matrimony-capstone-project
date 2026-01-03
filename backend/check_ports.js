const net = require('net');

const ports = [3306, 3307, 3308, 5432, 33006];
const hosts = ['localhost', '127.0.0.1'];

console.log('Scanning ports...');

function checkPort(port, host) {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        socket.setTimeout(2000);

        socket.on('connect', () => {
            console.log(`✅ [OPEN] ${host}:${port}`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ [TIMEOUT] ${host}:${port}`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            // console.log(`❌ [CLOSED] ${host}:${port} (${err.code})`);
            resolve(false);
        });

        socket.connect(port, host);
    });
}

(async () => {
    let found = false;
    for (const host of hosts) {
        for (const port of ports) {
            const isOpen = await checkPort(port, host);
            if (isOpen) found = true;
        }
    }

    if (!found) {
        console.log('No database ports found open.');
    } else {
        console.log('Scan complete. Use the OPEN port in your .env file.');
        console.log('Note: If localhost is OPEN but 127.0.0.1 is CLOSED (or vice versa), use the one that works.');
    }
})();
