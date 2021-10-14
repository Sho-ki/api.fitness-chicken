require('dotenv').config();
const express = require('express');
const app = express();
const signUp = require('../src/controllers/login');
const supertest = require('supertest');
app.listen(8080);
app.use(express.json());
app.use('/', signUp.signUp);

const data = { username: 'jest2', password: 'jest2' };
test('POST /api/posts', async () => {
  await supertest(app)
    .post('/signUp')
    .send(data)
    .then(async (response) => {
      // Check the response

      expect(response.statusCode).toBe(201);
    });
});

test('POST /api/posts', async () => {
  await supertest(app)
    .post('/signUp')
    .send(data)
    .then(async (response) => {
      // Check the response
      expect(response.statusCode).toBe(500);
      expect(response.body.errorMessage).toBe('Duplicate error');
    });
});
