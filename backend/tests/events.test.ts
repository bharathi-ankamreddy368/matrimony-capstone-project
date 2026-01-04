import request from 'supertest';
import app from '../src/app';

async function registerAndLogin(username: string, password: string, role = 'organizer') {
  await request(app).post('/auth/register').send({ username, password, role });
  const res = await request(app).post('/auth/login').send({ username, password });
  return res.body.token as string;
}

describe('Events API', () => {
  it('allows organizer to create and list events', async () => {
    const token = await registerAndLogin(`org${Date.now()}`, 'pass123', 'organizer');
    const ev = {
      name: 'Test Event',
      venue: 'Test Venue',
      date_time: '2099-01-01 10:00:00',
      capacity: 100,
      ticket_price: 10.5,
      category: 'Music'
    };
    const create = await request(app).post('/events').set('Authorization', `Bearer ${token}`).send(ev);
    expect(create.status).toBe(201);
    expect(create.body.name).toBe(ev.name);

    const list = await request(app).get('/events');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.find((e: any) => e.name === ev.name)).toBeTruthy();
  });

  it('validates required fields', async () => {
    const token = await registerAndLogin(`org2${Date.now()}`, 'pass123', 'organizer');
    const res = await request(app).post('/events').set('Authorization', `Bearer ${token}`).send({ venue: 'V', capacity: 10 });
    expect(res.status).toBe(400);
  });
});
