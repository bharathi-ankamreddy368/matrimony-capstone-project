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
require("dotenv/config");
const db_1 = __importDefault(require("../src/db"));
const migrate_1 = require("../src/migrate");
// Use a separate test DB name to avoid clobbering development DB
process.env.DB_NAME = process.env.DB_NAME_TEST || 'test_smart_event_planner';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // run migrations against test DB
    yield (0, migrate_1.migrate)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // clear data between tests
    const conn = yield db_1.default.getConnection();
    try {
        yield conn.query('SET FOREIGN_KEY_CHECKS = 0');
        yield conn.query('TRUNCATE TABLE bookings');
        yield conn.query('TRUNCATE TABLE events');
        yield conn.query('TRUNCATE TABLE users');
        yield conn.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    finally {
        conn.release();
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.end();
}));
