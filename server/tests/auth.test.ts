import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';
import { env } from '../src/config/env';

beforeAll(async () => {
  await mongoose.connect(env.mongodbUri);
  await User.deleteMany({ email: /test-auth@/ });
});

afterAll(async () => {
  await User.deleteMany({ email: /test-auth@/ });
  await mongoose.disconnect();
});

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test-auth@furnistore.com',
    password: 'TestPass123',
  };

  it('POST /auth/register creates a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('POST /auth/register rejects duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });

  it('POST /auth/login authenticates user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /auth/login rejects invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /auth/me requires authentication', async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.data.accessToken;

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });
});