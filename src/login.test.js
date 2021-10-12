// import app from './controllers/login';
// import 'jest';
// test('status 200 with id', async () => {
//   const req = [
//     {
//       body: {
//         username: 'jest1461',
//         password: 'jest1',
//       },
//     },
//     {
//       body: {
//         username: 'jest1461',
//         password: 'jest1',
//       },
//     },
//   ];

//   const res = [
//     {
//       status: 200,
//       send: jest.fn().mockReturnThis(),
//     },
//     {
//       status: 'Duplicate error',
//       send: jest.fn().mockReturnThis(),
//     },
//   ];

//   await app.signUp(req[0], res[0]).then((response) => {
//     console.log('response', response);
//     expect(response.status).toBe(res[0].status);
//   });
//   // await app.signUp(req[1], res[1]).then((response) => {
//   //   console.log(response);
//   //   expect(response.status).toBe(res[1].status);
//   // });
// });
require('dotenv').config();
const express = require('express');
const app = express();
const signUp = require('./controllers/login');
const supertest = require('supertest');
app.listen(8080);
app.use(express.json());
app.use('/', signUp.signUp);

const data = { username: 'jest2024', password: 'jest2007' };
test('POST /api/posts', async () => {
  await supertest(app)
    .post('/signUp')
    .send(data)
    .then(async (response) => {
      // Check the response
      console.log('response', response);
      expect(response.statusCode).toBe(201);
    });
});

test('POST /api/posts', async () => {
  await supertest(app)
    .post('/signUp')
    .send(data)
    .then(async (response) => {
      // Check the response
      console.log('response', response);
      expect(response.statusCode).toBe(500);
      expect(response.body.errorMessage).toBe('Duplicate error');
    });
});
