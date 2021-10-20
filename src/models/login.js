const util = require('util');
const bcrypt = require('bcrypt');
const connection = require('../db');

const hashPass = (password) => {
  if (!password) return null;
  return bcrypt.hashSync(password, 10);
};

const LoginModel = {
  signUp: async (email, password) => {
    try {
      const hashed_password = hashPass(password);

      const resultSignUp = await util
        .promisify(connection.query)
        .bind(connection)(`INSERT INTO users (email, password) VALUES (?,?)`, [
        email,
        hashed_password,
      ]);

      return resultSignUp.insertId;
    } catch (e) {
      throw new Error(String(e.code));
    }
  },

  createWorkoutCategory: async ({ userId }) => {
    try {
      await util.promisify(connection.query).bind(connection)(
        `INSERT INTO workout_categories (category,users_id) VALUES
        (?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId});`,
        [
          'Warm Up',
          'Arms',
          'Legs',
          'Chest',
          'Abs',
          'Glutes',
          'Back',
          'Shoulders',
          'Upper Body',
          'Lower Body',
          null,
        ]
      );

      return;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async ({ userId }) => {
    try {
      await util.promisify(connection.query).bind(connection)(
        `INSERT INTO workout_sets (day_of_week,users_id) VALUES
        (?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId}),(?, ${userId})`,
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      );

      return;
    } catch (e) {
      throw new Error(e);
    }
  },

  signIn: async (email, password) => {
    try {
      const resultFindEmail = await util
        .promisify(connection.query)
        .bind(connection)(`SELECT * FROM users WHERE email = (?)`, [email]);
      if (resultFindEmail.length <= 0) {
        throw new Error();
      }

      const isValidPass = await bcrypt.compare(
        password,
        resultFindEmail[0].password
      );
      if (!isValidPass) {
        throw new Error();
      }

      return { id: resultFindEmail[0].id };
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = LoginModel;
