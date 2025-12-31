import request from 'supertest';
import app from '../src/app';

async function registerAndLogin(username: string, password: string, role = 'attendee') {
  await request(app).post('/auth/register').send({ username, password, role });
  const res = await request(app).post('/auth/login').send({ username, password });
  return res.body.token as string;
}

async function createEventAsOrganizer() {
  const org = `org${Date.now()}`;
  await request(app).post('/auth/register').send({ username: org, password: 'pass123', role: 'organizer' });
  const login = await request(app).post('/auth/login').send({ username: org, password: 'pass123' });
  const token = login.body.token;
  const ev = {
    name: 'Capacity Event',
    venue: 'Venue',
    date_time: '2099-01-01 12:00:00',
    capacity: 2,
    ticket_price: 5
  };
  const create = await request(app).post('/events').set('Authorization', `Bearer ${token}`).send(ev);
  return create.body;
}

describe('Bookings API', () => {
  it('allows attendee to book tickets and enforces capacity', async () => {
    const event = await createEventAsOrganizer();
    const attendeeToken = await registerAndLogin(`att${Date.now()}`, 'pass123', 'attendee');

    // book 2 tickets (full)
    const b1 = await request(app).post('/bookings').set('Authorization', `Bearer ${attendeeToken}`).send({ event_id: event.id, tickets_booked: 2 });
    expect(b1.status).toBe(201);
    expect(b1.body.tickets_booked).toBe(2);

    // another attendee tries to book 1 ticket -> should fail due to capacity
    const attendeeToken2 = await registerAndLogin(`att2${Date.now()}`, 'pass123', 'attendee');
    const b2 = await request(app).post('/bookings').set('Authorization', `Bearer ${attendeeToken2}`).send({ event_id: event.id, tickets_booked: 1 });
    expect(b2.status).toBe(400);
    expect(b2.body.error).toMatch(/Not enough seats/);
  });
});
