
import pool from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  role: 'organizer' | 'attendee' | 'admin';
  created_at?: string;
}

export const createUser = async (username: string, password_hash: string, role: 'organizer' | 'attendee' | 'admin' = 'attendee') => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
    [username, password_hash, role]
  );
  return {
    id: result.insertId,
    username,
    role
  };
};

export const getUserById = async (id: number) => {
  const [rows] = await pool.query<UserRow[]>(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

export const findUserByUsername = async (username: string) => {
  const [rows] = await pool.query<UserRow[]>(`SELECT * FROM users WHERE username = ?`, [username]);
  return rows[0];
};
