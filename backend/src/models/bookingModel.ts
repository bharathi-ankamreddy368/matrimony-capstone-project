import pool from '../db';

export interface BookingRow {
  id?: number;
  event_id: number;
  attendee_id: number;
  tickets_booked: number;
  total_price: number;
  booking_time?: string;
}

export const createBooking = async (b: BookingRow) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [evResult] = await conn.query(`SELECT capacity FROM events WHERE id = ? FOR UPDATE`, [b.event_id]);
    // @ts-ignore
    const ev = (evResult as any[])[0];
    if (!ev) throw new Error('Event not found');
    // @ts-ignore
    const [bookedResult] = await conn.query(`SELECT IFNULL(SUM(tickets_booked),0) as booked FROM bookings WHERE event_id = ?`, [b.event_id]);
    // @ts-ignore
    const booked = (bookedResult as any[])[0].booked;
    const remaining = Number((ev as any).capacity) - Number(booked);
    if (b.tickets_booked <= 0) throw new Error('tickets_booked must be > 0');
    if (b.tickets_booked > remaining) throw new Error('Not enough seats available');

    const [insertResult] = await conn.query(
      `INSERT INTO bookings (event_id, attendee_id, tickets_booked, total_price) VALUES (?, ?, ?, ?)`,
      [b.event_id, b.attendee_id, b.tickets_booked, b.total_price]
    );
    // @ts-ignore
    const insertId = (insertResult as any).insertId;
    await conn.commit();
    const [finalRow] = await pool.query(`SELECT * FROM bookings WHERE id = ?`, [insertId]);
    // @ts-ignore
    return (finalRow as any[])[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getBookingById = async (id: number) => {
  const [rows] = await pool.query(`SELECT * FROM bookings WHERE id = ?`, [id]);
  // @ts-ignore
  return (rows as any[])[0];
};

export const listBookingsByEvent = async (eventId: number) => {
  const [rows] = await pool.query(`SELECT * FROM bookings WHERE event_id = ?`, [eventId]);
  // @ts-ignore
  return (rows as any[]);
};

export const listBookingsByAttendee = async (attendeeId: number) => {
  const [rows] = await pool.query(`SELECT * FROM bookings WHERE attendee_id = ? ORDER BY booking_time DESC`, [attendeeId]);
  // @ts-ignore
  return (rows as any[]);
};
