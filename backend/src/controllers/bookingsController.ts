import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as model from '../models/bookingModel';
import * as eventModel from '../models/eventModel';
import QRCode from 'qrcode';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { event_id, tickets_booked, total_price } = req.body;
  const attendee_id = req.user?.id;
  if (!attendee_id || isNaN(Number(attendee_id))) return res.status(401).json({ error: 'Unauthenticated or invalid user ID' });
  if (!event_id || isNaN(Number(event_id)) || !tickets_booked) return res.status(400).json({ error: 'valid event_id and tickets_booked are required' });
  const ev = await eventModel.getEventById(Number(event_id));
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  if (ev.status === 'cancelled') return res.status(400).json({ error: 'Event is cancelled' });
  try {
    const price = total_price !== undefined ? Number(total_price) : (Number(ev.ticket_price || 0) * Number(tickets_booked));
    const booking = await model.createBooking({ event_id: Number(event_id), attendee_id: Number(attendee_id), tickets_booked: Number(tickets_booked), total_price: price });
    const qrData = JSON.stringify({ booking_id: booking.id, event_id: booking.event_id });
    const qr = await QRCode.toDataURL(qrData);
    res.status(201).json({ ...booking, qr });
  } catch (err: any) {
    const msg = err.message || 'Booking failed';
    res.status(400).json({ error: msg });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid booking ID' });
  const b = await model.getBookingById(id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  const qrData = JSON.stringify({ booking_id: b.id, event_id: b.event_id });
  const qr = await QRCode.toDataURL(qrData);
  res.json({ ...b, qr });
};

export const listBookingsForEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);
  if (isNaN(eventId)) return res.status(400).json({ error: 'Invalid event ID' });
  const ev = await eventModel.getEventById(eventId);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const bookings = await model.listBookingsByEvent(eventId);
  res.json(bookings);
};

export const listMyBookings = async (req: AuthRequest, res: Response) => {
  const attendee_id = req.user?.id;
  if (!attendee_id) return res.status(401).json({ error: 'Unauthenticated' });
  const rows = await model.listBookingsByAttendee(Number(attendee_id));
  res.json(rows);
};
