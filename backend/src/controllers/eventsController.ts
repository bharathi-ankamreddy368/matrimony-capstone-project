import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as model from '../models/eventModel';
import { unlink } from 'fs/promises';
import path from 'path';
import pool from '../db';

export const listEvents = async (req: Request, res: Response) => {
  try {
    const { category, date, venue } = req.query;
    const events = await model.listEvents({ category: category as string | undefined, date: date as string | undefined, venue: venue as string | undefined });
    const mapped = await Promise.all(events.map(async (e: any) => {
      const seats = await model.getAvailableSeats(e.id);
      return { ...e, available_seats: seats };
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: 'Failed to list events' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ev = await model.getEventById(id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const seats = await model.getAvailableSeats(id);
  res.json({ ...ev, available_seats: seats });
};

export const createEvent = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.venue || !body.date_time) return res.status(400).json({ error: 'name, venue and date_time are required' });
  if (!body.capacity || Number(body.capacity) <= 0) return res.status(400).json({ error: 'capacity must be > 0' });
  const organizer_id = req.user ? Number(req.user.id) : undefined;
  try {
    const created = await model.createEvent({
      organizer_id: organizer_id as number,
      name: body.name,
      description: body.description,
      venue: body.venue,
      date_time: body.date_time,
      category: body.category,
      capacity: Number(body.capacity),
      ticket_price: body.ticket_price ? Number(body.ticket_price) : 0,
      image_url: body.image_url || null
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

const ensureOwnerOrAdmin = (req: AuthRequest, ev: any) => {
  if (!req.user) return false;
  if (req.user.role === 'admin') return true;
  return Number(req.user.id) === Number(ev.organizer_id);
};

export const listOrganizerEvents = async (req: AuthRequest, res: Response) => {
  const organizerId = req.user?.id;
  if (!organizerId) return res.status(401).json({ error: 'Unauthenticated' });
  const events = await model.listEventsByOrganizer(Number(organizerId));
  const mapped = await Promise.all(events.map(async (e: any) => {
    const seats = await model.getAvailableSeats(e.id);
    return { ...e, available_seats: seats };
  }));
  res.json(mapped);
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await model.getEventById(id);
  if (!exists) return res.status(404).json({ error: 'Event not found' });
  if (!ensureOwnerOrAdmin(req as AuthRequest, exists)) return res.status(403).json({ error: 'Forbidden' });
  if (req.body.capacity !== undefined && Number(req.body.capacity) <= 0) return res.status(400).json({ error: 'capacity must be > 0' });
  // if decreasing capacity, ensure not less than tickets sold
  if (req.body.capacity !== undefined && Number(req.body.capacity) < exists.capacity) {
    const [bookingRes] = await pool.query(`SELECT IFNULL(SUM(tickets_booked),0) as booked FROM bookings WHERE event_id = ?`, [id]);
    // @ts-ignore
    const sold = Number((bookingRes as any[])[0].booked);
    if (Number(req.body.capacity) < sold) return res.status(400).json({ error: 'New capacity less than tickets already sold' });
  }
  if (req.body.ticket_price !== undefined && Number(req.body.ticket_price) < 0) return res.status(400).json({ error: 'ticket_price must be >= 0' });
  const updated = await model.updateEvent(id, req.body);
  res.json(updated);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const exists = await model.getEventById(id);
  if (!exists) return res.status(404).json({ error: 'Event not found' });
  if (!ensureOwnerOrAdmin(req as AuthRequest, exists)) return res.status(403).json({ error: 'Forbidden' });
  await model.deleteEvent(id);
  res.status(204).send();
};

export const cancelEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ev = await model.getEventById(id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  if (!ensureOwnerOrAdmin(req as AuthRequest, ev)) return res.status(403).json({ error: 'Forbidden' });
  await model.updateEvent(id, { status: 'cancelled' });
  res.status(200).json({ message: 'Event cancelled' });
};

export const uploadImage = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ev = await model.getEventById(id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  if (!ensureOwnerOrAdmin(req as AuthRequest, ev)) return res.status(403).json({ error: 'Forbidden' });
  if (!(req as any).file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${(req as any).file.filename}`;
  try {
    if (ev.image_url) {
      const existingPath = path.join(__dirname, '..', '..', ev.image_url.replace(/^\//, ''));
      await unlink(existingPath).catch(() => { });
    }
  } catch { }
  const updated = await model.updateEvent(id, { image_url: url });
  res.json(updated);
};
