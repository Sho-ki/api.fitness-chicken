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

      return resultSignUp;
    } catch (e) {
      throw new Error(String(e.code));
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
