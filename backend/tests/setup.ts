import 'dotenv/config';
import pool from '../src/db';
import { migrate } from '../src/migrate';

// Use a separate test DB name to avoid clobbering development DB
process.env.DB_NAME = process.env.DB_NAME_TEST || 'test_smart_event_planner';

beforeAll(async () => {
  // run migrations against test DB
  await migrate();
});

beforeEach(async () => {
  // clear data between tests
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE bookings');
    await conn.query('TRUNCATE TABLE events');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    conn.release();
  }
});

afterAll(async () => {
  await pool.end();
});
