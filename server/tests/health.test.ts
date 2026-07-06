import request from 'supertest';
import app from '../src/app';

describe('Health API', () => {
  it('GET /api/v1/health returns ok status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('GET / returns API info', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('FurniStore API');
  });
});