require('dotenv').config();
const express = require('express');
const app = express();
const signIn = require('../controllers/login');
const supertest = require('supertest');
app.use(express.json());
app.use('/', signIn.signIn);

const { defineFeature, loadFeature } = require('jest-cucumber');

const feature = loadFeature('./src/features/signin.feature');

defineFeature(feature, (test) => {
  test('Signin successfully', ({ given, when, then, and }) => {
    let userData;
    let email;
    let password;
    let res;

    given('I have users:', (table) => {
      userData = table;
    });

    when("I type an existed email in 'email'", () => {
      email = userData[0].email;
    });

    and("I type a valid password in 'password'", () => {
      password = userData[0].password;
    });

    and("I click on 'signin'", async () => {
      const data = { email, password };
      res = await supertest(app).post('/signIn').send(data);
    });

    then('I should see status code 200', () => {
      expect(res.statusCode).toBe(200);
    });
  });

  test('Wrong password', ({ when, and, then }) => {
    let email;
    let password;
    let res;

    when("I type an no-existed email in 'email'", (arg0) => {
      email = 'invaliduser4@user.com';
    });

    and("I type an invalid password in 'password'", (arg0) => {
      password = '123456';
    });

    and("I click on 'signin'", async () => {
      const data = { email, password };
      res = await supertest(app).post('/signUp').send(data);
    });

    then('I should see status code 400', () => {
      expect(res.statusCode).toBe(400);
      expect(res.body.errorMessage).toBe('NO USERS FOUND');
    });
  });
});

// const data = { email: 'jest100', password: '101' };
// test('POST /api/posts', async () => {
//   await supertest(app)
//     .post('/signUp')
//     .send(data)
//     .then(async (response) => {
//       // Check the response

//       expect(response.statusCode).toBe(201);
//     });
// });

// test('POST /api/posts', async () => {
//   await supertest(app)
//     .post('/signUp')
//     .send(data)
//     .then(async (response) => {
//       // Check the response
//       expect(response.statusCode).toBe(500);
//       expect(response.body.errorMessage).toBe('Duplicate error');
//     });
// });
