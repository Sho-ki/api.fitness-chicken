const util = require("util");
const bcrypt = require("bcrypt");
const connection = require("./db");

const WorkoutModel = {
  signIn: async (username, password) => {
    try {
      const hashed_password = bcrypt.hashSync(password, 10);
      const resultSignIn = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );

      return resultSignIn;
    } catch (e) {
      throw new Error(e);
    }
  },

  login: async (username, password) => {
    try {
      const resultFindUsername = await util
        .promisify(connection.execute)
        .bind(connection)(`SELECT * FROM user WHERE username = '${username}'`);
      if (resultFindUsername.length <= 0) {
        return "NO USERS FOUND";
      }

      const isValidPass = await verifyPass(
        password,
        resultFindUsername[0].password
      );

      return isValidPass ? true : false;
    } catch (e) {
      throw new Error(e);
    }
  },

  createUserWorkouts: async (day, userId) => {
    try {
      let queryState;
      if (day !== null) {
        queryState = `INSERT INTO user_workouts (scheduled_day, user_id) VALUES('${day}', '${userId}')`;
      } else {
        queryState = `INSERT INTO user_workouts (user_id) VALUES(${userId})`;
      }

      const resultCreateUserWorkouts = await util
        .promisify(connection.execute)
        .bind(connection)(queryState);

      return resultCreateUserWorkouts.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutCategory: async (category) => {
    try {
      const resultCreateWorkoutCategory = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_categories (label) VALUES('${category}')`
      );

      return resultCreateWorkoutCategory.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async ({
    name,
    sets,
    times,
    workoutCategoryId,
    userWorkoutsId,
    userId,
  }) => {
    try {
      const resultCreateWorkoutSet = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_sets(training_name, sets, times, workout_categories_id, user_workouts_id,user_workouts_user_id) VALUES(?,?,?,?,?,?)`,
        [name, sets, times, workoutCategoryId, userWorkoutsId, userId]
      );
      return resultCreateWorkoutSet;
    } catch (e) {
      throw new Error(e);
    }
  },

  updateSchedule: async (newDay, userId) => {
    try {
      const resultUpdateSchedule = await util
        .promisify(connection.execute)
        .bind(connection)(`UPDATE user_workouts SET scheduled_day = ${newDay}`);
      return createWorkoutSet;
    } catch (e) {}
  },
};

async function verifyPass(passA, passB) {
  const passwordCheck = await bcrypt.compare(passA, passB);

  return passwordCheck;
}

module.exports = WorkoutModel;
