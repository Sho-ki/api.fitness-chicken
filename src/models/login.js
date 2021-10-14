const util = require('util');
const bcrypt = require('bcrypt');
const connection = require('../db');

const LoginModel = {
  signUp: async (email, password) => {
    try {
      const hashed_password = bcrypt.hashSync(password, 10);

      const resultSignUp = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO user (email, password) VALUES ('${email}', '${hashed_password}')`
      );
      return resultSignUp;
    } catch (e) {
      throw new Error(e);
    }
  },

  signIn: async (email, password) => {
    try {
      const resultFindEmail = await util
        .promisify(connection.query)
        .bind(connection)(`SELECT * FROM user WHERE email = '${email}'`);
      if (resultFindEmail.length <= 0) {
        return 'NO USERS FOUND';
      }

      const isValidPass = await bcrypt.compare(
        password,
        resultFindEmail[0].password
      );

      return { id: resultFindEmail[0].id, isValidLogin: isValidPass };
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = LoginModel;
