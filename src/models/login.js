const util = require("util");
const bcrypt = require("bcrypt");
const connection = require("../db");

const LoginModel = {
  signUp: async (username, password) => {
    try {
      const hashed_password = bcrypt.hashSync(password, 10);

      const resultSignUp = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );

      return resultSignUp;
    } catch (e) {
      throw new Error(e);
    }
  },

  signIn: async (username, password) => {
    try {
      const resultFindUsername = await util
        .promisify(connection.execute)
        .bind(connection)(`SELECT * FROM user WHERE username = '${username}'`);
      if (resultFindUsername.length <= 0) {
        return "NO USERS FOUND";
      }

      const isValidPass = await bcrypt.compare(
        password,
        resultFindUsername[0].password
      );

      return { id: resultFindUsername[0].id, isValidLogin: isValidPass };
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = LoginModel;
