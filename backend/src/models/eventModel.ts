import pool from '../db';

export interface EventRow {
  id?: number;
  organizer_id: number;
  name: string;
  description?: string;
  venue: string;
  date_time: string;
  category?: string;
  capacity: number;
  ticket_price?: number;
  image_url?: string | null;
  status?: 'active' | 'cancelled';
  created_at?: string;
}

export const createEvent = async (ev: EventRow) => {
  const [result] = await pool.query(
    `INSERT INTO events (organizer_id, name, description, venue, date_time, category, capacity, ticket_price, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ev.organizer_id, ev.name, ev.description || null, ev.venue, ev.date_time, ev.category || null, ev.capacity, ev.ticket_price || 0.00, ev.image_url || null, ev.status || 'active']
  );
  // @ts-ignore
  const insertId = (result as any).insertId;
  return getEventById(insertId);
};

export const updateEvent = async (id: number, payload: Partial<EventRow>) => {
  const fields = [];
  const values: any[] = [];
  if (payload.name !== undefined) { fields.push('name = ?'); values.push(payload.name); }
  if (payload.description !== undefined) { fields.push('description = ?'); values.push(payload.description); }
  if (payload.venue !== undefined) { fields.push('venue = ?'); values.push(payload.venue); }
  if (payload.date_time !== undefined) { fields.push('date_time = ?'); values.push(payload.date_time); }
  if (payload.category !== undefined) { fields.push('category = ?'); values.push(payload.category); }
  if (payload.capacity !== undefined) { fields.push('capacity = ?'); values.push(payload.capacity); }
  if (payload.ticket_price !== undefined) { fields.push('ticket_price = ?'); values.push(payload.ticket_price); }
  if (payload.image_url !== undefined) { fields.push('image_url = ?'); values.push(payload.image_url); }
  if (payload.status !== undefined) { fields.push('status = ?'); values.push(payload.status); }
  if (!fields.length) return getEventById(id);
  values.push(id);
  await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);
  return getEventById(id);
};

export const deleteEvent = async (id: number) => {
  await pool.query(`DELETE FROM events WHERE id = ?`, [id]);
  return true;
};

export const getEventById = async (id: number) => {
  const [rows] = await pool.query(`SELECT * FROM events WHERE id = ?`, [id]);
  // @ts-ignore
  return (rows as any[])[0];
};

export const listEvents = async (filters: { category?: string; date?: string; venue?: string }) => {
  const where: string[] = [];
  const params: any[] = [];
  if (filters.category) { where.push('category = ?'); params.push(filters.category); }
  if (filters.venue) { where.push('venue = ?'); params.push(filters.venue); }
  if (filters.date) { where.push('DATE(date_time) = ?'); params.push(filters.date); }
  const q = `SELECT * FROM events ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY date_time ASC`;
  const [rows] = await pool.query(q, params);
  // @ts-ignore
  return (rows as any[]);
};

export const getAvailableSeats = async (eventId: number) => {
  const [rows] = await pool.query(`SELECT capacity FROM events WHERE id = ?`, [eventId]);
  // @ts-ignore
  const ev = (rows as any[])[0];
  if (!ev) return null;
  const [res] = await pool.query(
    `SELECT IFNULL(SUM(tickets_booked), 0) as booked FROM bookings WHERE event_id = ?`, [eventId]
  );
  // @ts-ignore
  const booked = (res as any[])[0].booked;
  return ev.capacity - Number(booked);
};

export const listEventsByOrganizer = async (organizerId: number) => {
  const [rows] = await pool.query(`SELECT * FROM events WHERE organizer_id = ? ORDER BY date_time ASC`, [organizerId]);
  // @ts-ignore
  return (rows as any[]);
};
