const util = require("util");
const bcrypt = require("bcrypt");

const WorkoutModel = {
  signIn: async (username, password) => {
    try {
      let hashed_password = bcrypt.hashSync(password, 10);
      console.log(hashed_password, username);
      console.log(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );
      const result = await util.promisify(connection.execute).bind(connection)(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );

      return result;
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = WorkoutModel;
