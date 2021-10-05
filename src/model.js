const util = require("util");
const bcrypt = require("bcrypt");
const connection = require("./db");

const WorkoutModel = {
  signIn: async (username, password) => {
    try {
      const hashed_password = bcrypt.hashSync(password, 10);
      const result = await util.promisify(connection.execute).bind(connection)(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );

      return result;
    } catch (e) {
      throw new Error(e);
    }
  },

  login: async (username, password) => {
    try {
      const findUsername = await util
        .promisify(connection.execute)
        .bind(connection)(`SELECT * FROM user WHERE username = '${username}'`);
      if (findUsername.length <= 0) {
        return "NO USERS FOUND";
      }

      const isValidPass = await verifyPass(password, findUsername[0].password);

      return isValidPass ? true : false;
    } catch (e) {
      throw new Error(e);
    }
  },
};

async function verifyPass(passA, passB) {
  const passwordCheck = await bcrypt.compare(passA, passB);

  return passwordCheck;
}

module.exports = WorkoutModel;
