require('dotenv').config();
const express = require('express');
const app = express();
const login = require('../controllers/login');
const supertest = require('supertest');

app.use(express.json());
app.use('/signUp', login.signUp);
app.use('/signIn', login.signIn);

const email =
  (Math.random() * Math.random()).toString(36).slice(2, 10) + '@test.com';
const password = 'jest1';

const signUpData = [
  [email, password, 201, 'Successfully created'],
  [
    email,
    password,
    500,
    'duplicate key value violates unique constraint "email_unique"',
  ],
  [
    email,
    null,
    500,
    'null value in column "password" of relation "users" violates not-null constraint',
  ],
  [
    null,
    password,
    500,
    'null value in column "email" of relation "users" violates not-null constraint',
  ],
];
const signInData = [
  [email, password, 200, 'Sign in successfully'],
  ['pre' + email, password, 500, 'Wrong email or password'],
  [email, 'pre' + password, 500, 'Wrong email or password'],
  [email, null, 500, 'Wrong email or password'],
  [null, password, 500, 'Wrong email or password'],
];

describe('Login', () => {
  test.each(signUpData)(
    'SIGNUP email: %s, password: %s, expected status code: %i, message: %s',
    async (email, password, expectedStatus, expectedMessage) => {
      await supertest(app)
        .post('/signUp')
        .send({ email, password })
        .then(async (response) => {
          expect(response.statusCode).toBe(expectedStatus);
          expect(response.body.message).toBe(expectedMessage);
        });
    }
  );
  test.each(signInData)(
    'SIGNIN email: %s, password: %s, expected status code: %i, message: %s',
    async (email, password, expectedStatus, expectedMessage) => {
      await supertest(app)
        .post('/signIn')
        .send({ email, password })
        .then(async (response) => {
          expect(response.statusCode).toBe(expectedStatus);
          expect(response.body.message).toBe(expectedMessage);
        });
    }
  );
});
