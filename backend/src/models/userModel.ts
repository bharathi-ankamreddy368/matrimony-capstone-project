import pool from '../db';

export interface UserRow {
  id?: number;
  username: string;
  password_hash: string;
  role?: 'organizer' | 'attendee' | 'admin';
  created_at?: string;
}

export const createUser = async (username: string, password_hash: string, role: 'organizer' | 'attendee' | 'admin' = 'attendee') => {
  const [res] = await pool.query(`INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`, [username, password_hash, role]);
  // @ts-ignore
  const id = (res as any).insertId;
  return getUserById(id);
};

export const getUserById = async (id: number) => {
  const [rows] = await pool.query(`SELECT id, username, role, created_at FROM users WHERE id = ?`, [id]);
  // @ts-ignore
  return (rows as any[])[0];
};

export const findUserByUsername = async (username: string) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);
  // @ts-ignore
  return (rows as any[])[0];
};
