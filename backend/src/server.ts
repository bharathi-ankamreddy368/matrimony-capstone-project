import 'dotenv/config';
import app from './app';
import { db } from './config/db.config';
import { initDb } from './setup/db.init';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => {
    try {



        // Initialize other DB tables
        await initDb();

        // Start server
        app.listen(port, () => {
            console.log(`Server listening on port ${port} `);
        });

    } catch (err) {
        console.error('Startup Error:', err);
        process.exit(1);
    }
})();

