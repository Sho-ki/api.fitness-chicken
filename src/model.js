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

  createUserWorkouts: async (day, userId) => {
    try {
      let queryState;
      if (day !== null) {
        queryState = `INSERT INTO user_workouts (scheduled_day, user_id) VALUES('${day}', '${userId}')`;
      } else {
        queryState = `INSERT INTO user_workouts (user_id) VALUES(${userId})`;
      }
      const createUserWorkouts = await util
        .promisify(connection.execute)
        .bind(connection)(queryState);

      return createUserWorkouts.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutCategory: async (category) => {
    try {
      console.log(
        `INSERT INTO workout_categories (label) VALUES('${category}')`
      );
      const createWorkoutCategory = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_categories (label) VALUES('${category}')`
      );

      console.log("OK", createWorkoutCategory);
      return createWorkoutCategory.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async (
    name,
    sets,
    times,
    userWorkoutsId,
    workoutCategoryId,
    userId
  ) => {
    console.log(name, sets, times, userWorkoutsId, workoutCategoryId, userId);
    console.log(
      `INSERT INTO workout_sets(training_name, sets, times, workout_categories_id, user_workouts_id,user_workouts_user_id) VALUES(?,?,?,?,?,?)`
    );
    try {
      const createWorkoutSet = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_sets(training_name, sets, times, workout_categories_id, user_workouts_id,user_workouts_user_id) VALUES(?,?,?,?,?,?)`,
        [name, sets, times, userWorkoutsId, workoutCategoryId, userId]
      );
      console.log(createWorkoutSet);
      return createWorkoutSet;
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
