import { Request, Response } from 'express';
import pool from '../db';

export const analytics = async (_req: Request, res: Response) => {
  try {
    const [res1] = await pool.query(`SELECT COUNT(*) as total_events FROM events`);
    // @ts-ignore
    const total_events = (res1 as any[])[0].total_events;

    const [res2] = await pool.query(`SELECT COUNT(*) as total_bookings FROM bookings`);
    // @ts-ignore
    const total_bookings = (res2 as any[])[0].total_bookings;

    const [res3] = await pool.query(`SELECT IFNULL(SUM(total_price),0) as total_revenue FROM bookings`);
    // @ts-ignore
    const total_revenue = (res3 as any[])[0].total_revenue;

    const [res4] = await pool.query(`SELECT COUNT(*) as total_users FROM users`);
    // @ts-ignore
    const total_users = (res4 as any[])[0].total_users;

    const [top] = await pool.query(`
      SELECT e.id, e.name, e.ticket_price, IFNULL(SUM(b.tickets_booked),0) as tickets_sold
      FROM events e
      LEFT JOIN bookings b ON b.event_id = e.id
      GROUP BY e.id
      ORDER BY tickets_sold DESC
      LIMIT 5
    `);
    // @ts-ignore
    res.json({
      total_events: total_events || 0,
      total_bookings: total_bookings || 0,
      total_revenue: Number(total_revenue) || 0,
      total_users: total_users || 0,
      top_events: top
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
