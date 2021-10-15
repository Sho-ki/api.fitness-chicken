require('dotenv').config();
const express = require('express');
const app = express();
const signUp = require('../controllers/login');
const supertest = require('supertest');
app.use(express.json());
app.use('/', signUp.signUp);

const { defineFeature, loadFeature } = require('jest-cucumber');

const feature = loadFeature('./src/features/signup.feature');

defineFeature(feature, (test) => {
  test('Signup successfully', ({ given, when, then, and }) => {
    let userData;
    let email;
    let password;
    let res;

    given('I make users:', (table) => {
      userData = table;
    });

    when("I type my email in 'email'", () => {
      email = userData[0].email;
    });
    and("I type my password in 'password'", () => {
      password = userData[0].password;
    });

    and("I click on 'signup'", async () => {
      const data = { email, password };
      res = await supertest(app).post('/signUp').send(data);
    });

    then('I should see status code 201', () => {
      expect(res.statusCode).toBe(201);
    });
  });

  test("'email' duplicate error", ({ given, when, and, then }) => {
    let userData;
    let email;
    let password;
    let res;

    given('I use existed users:', (table) => {
      userData = table;
    });

    when("I type my email in 'email'", (arg0) => {
      email = userData[0].email;
    });

    and("I type my password in 'password'", (arg0) => {
      password = userData[0].password;
    });

    and("I click on 'signup'", async () => {
      const data = { email, password };
      res = await supertest(app).post('/signUp').send(data);
    });

    then('I should see status code 500', () => {
      expect(res.statusCode).toBe(500);
      expect(res.body.errorMessage).toBe('Duplicate error');
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
