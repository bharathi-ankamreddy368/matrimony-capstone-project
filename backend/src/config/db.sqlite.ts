import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(process.cwd(), 'database.sqlite'),
            driver: sqlite3.Database
        });
    }
    return dbInstance;
}

export const dbRequest = {
    // Mock the pool interface if needed, but the app uses db.query primarily through the db export below
};

// Mocking the mysql2 promise interface
export const db = {
    query: async <T = any>(sql: string, params: any[] = []): Promise<[T, any]> => {
        const conn = await getDb();

        // Simple basic SQL dialect conversion if needed
        // SQLite doesn't support AUTO_INCREMENT (uses AUTOINCREMENT) but checking existing schema, it should be fine if we use existing DB.

        const isSelect = sql.trim().toLowerCase().startsWith('select');

        try {
            if (isSelect) {
                const rows = await conn.all(sql, params);
                return [rows as any, []];
            } else {
                const result = await conn.run(sql, params);
                // Simulate MySQL ResultSetHeader
                const header = {
                    insertId: result.lastID,
                    affectedRows: result.changes,
                    warningStatus: 0,
                };
                // Cast to T just to satisfy typescript generic
                return [header as any, []];
            }
        } catch (error) {
            console.error("SQLite Query Error:", sql, error);
            throw error;
        }
    },
    end: async () => {
        if (dbInstance) {
            await dbInstance.close();
        }
    }
};
