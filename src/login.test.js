import app from './controllers/user';
import request from 'supertest';

describe('result.ts', async () => {
  it('正しい引数', () => {
    await request(app)
      .get('/api/workouts/110')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
