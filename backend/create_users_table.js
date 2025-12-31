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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_config_1 = require("./src/config/db.config");
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log("Users table ensured.");
        const salt = yield bcryptjs_1.default.genSalt(10);
        const adminHash = yield bcryptjs_1.default.hash('admin123', salt);
        const userHash = yield bcryptjs_1.default.hash('user123', salt);
        yield db_config_1.db.query(`
            INSERT IGNORE INTO users (username, password, role) VALUES 
            ('admin', ?, 'organizer'),
            ('user', ?, 'attendee')
        `, [adminHash, userHash]);
        console.log("Default users seeded (passwords hashed).");
        process.exit(0);
    }
    catch (err) {
        if (err && err.code === 'ECONNREFUSED') {
            console.error('Failed to connect to MySQL. Please ensure MySQL server is running and the DB config in .env is correct.');
            console.error('If you prefer Docker, run `npm run compose:up` in the backend folder (ensure Docker is installed).');
        }
        else {
            console.error(err);
        }
        process.exit(1);
    }
});
seedUsers();
