"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("./src/config/db.config");
const checkTable = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_config_1.db.query(`SELECT 1 FROM users LIMIT 1`);
        console.log("Users table exists.");
    }
    catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
            console.log("Users table does NOT exist. Creating...");
            try {
                yield db_config_1.db.query(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(50) NOT NULL DEFAULT 'attendee',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `);
                console.log("Users table created.");
                // Seed with hashed passwords
                const bcrypt = require('bcryptjs');
                const salt = bcrypt.genSaltSync(10);
                const adminHash = bcrypt.hashSync('admin123', salt);
                const userHash = bcrypt.hashSync('user123', salt);
                yield db_config_1.db.query(`
                    INSERT IGNORE INTO users (username, password, role) VALUES 
                    ('admin', ?, 'organizer'),
                    ('user', ?, 'attendee')
                `, [adminHash, userHash]);
                console.log("Seeded with hashed passwords.");
            }
            catch (e) {
                console.error("Failed to create table:", e);
            }
        }
        else {
            console.error("Error checking table:", err);
        }
    }
    process.exit(0);
});
checkTable();
