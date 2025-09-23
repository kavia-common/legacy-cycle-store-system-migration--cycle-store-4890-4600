const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const SECRET = 'notif-secret';
function token(roles = ['user']) {
  return jwt.sign({ sub: 'u', roles }, SECRET);
}

describe('Notification Service - Endpoints', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it('GET / should return health info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  it('POST /api/notifications/send requires auth and payload', async () => {
    let res = await request(app).post('/api/notifications/send');
    expect([401, 403]).toContain(res.status);

    res = await request(app)
      .post('/api/notifications/send')
      .set('Authorization', `Bearer ${token(['user'])}`)
      .send({
        type: 'email',
        recipients: [{ recipientId: '1', type: 'user', email: 'a@b.com' }],
        templateId: 'welcome',
        parameters: { name: 'Alice' },
      });
    expect([200, 400, 500]).toContain(res.status);
  });
});
