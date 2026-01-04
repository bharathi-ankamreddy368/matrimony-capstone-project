import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const username = `user${Date.now()}`;
    const password = 'password123';

    const reg = await request(app).post('/auth/register').send({ username, password, role: 'attendee' });
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/auth/login').send({ username, password });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    expect(login.body.user).toMatchObject({ username, role: 'attendee' });
  });

  it('rejects duplicate username', async () => {
    const username = `dup${Date.now()}`;
    const password = 'password123';
    await request(app).post('/auth/register').send({ username, password });
    const res = await request(app).post('/auth/register').send({ username, password });
    expect(res.status).toBe(409);
  });
});
