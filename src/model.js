const util = require("util");
const bcrypt = require("bcrypt");
const connection = require("./db");

const WorkoutModel = {
  signIn: async (username, password) => {
    try {
      const hashed_password = bcrypt.hashSync(password, 10);
      console.log(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );
      const resultSignIn = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO user (username, password) VALUES ('${username}', '${hashed_password}')`
      );
      console.log(resultSignIn);
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

      return { id: resultFindUsername[0].id, isValidLogin: isValidPass };
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

  createWorkoutCategory: async (category, userId) => {
    try {
      const resultCreateWorkoutCategory = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_categories (label, user_id)SELECT * FROM (SELECT '${category}', ${userId})as tmp WHERE NOT EXISTS (SELECT * FROM workout_categories WHERE user_id=${userId} and label='${category}');
          `
      );

      if (resultCreateWorkoutCategory.insertId === 0) {
        const getExistingCategoryId = await util
          .promisify(connection.execute)
          .bind(connection)(
          `SELECT id FROM workout_categories WHERE user_id=${userId} and label='${category}'`
        );

        return getExistingCategoryId[0].id;
      }
      return resultCreateWorkoutCategory.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async ({
    name,
    sets,
    times,
    orderIndex,
    workoutCategoryId,
    userWorkoutsId,
    userId,
  }) => {
    try {
      const resultCreateWorkoutSet = await util
        .promisify(connection.execute)
        .bind(connection)(
        `INSERT INTO workout_sets(training_name, sets, times, order_index,workout_categories_id, user_workouts_id,user_workouts_user_id) VALUES(?,?,?,?,?,?,?)`,
        [
          name,
          sets,
          times,
          orderIndex,
          workoutCategoryId,
          userWorkoutsId,
          userId,
        ]
      );
      return resultCreateWorkoutSet;
    } catch (e) {
      throw new Error(e);
    }
  },
  updateWorkoutWithDayChange: async ({
    newDay,
    workoutId,
    userId,
    category,
    name,
    sets,
    times,
  }) => {
    try {
      let maxOrderIndex = await util
        .promisify(connection.execute)
        .bind(connection)(
        `SELECT max(order_index) as maxOrderIndex FROM workout_sets 
        LEFT JOIN user_workouts ON user_workouts.id = user_workouts_id 
        WHERE workout_sets.user_workouts_user_id = ${userId} and scheduled_day="${newDay}";`
      );

      maxOrderIndex =
        maxOrderIndex[0].maxOrderIndex !== null
          ? maxOrderIndex[0].maxOrderIndex + 1
          : 1;

      const resultUpdateWorkoutWithDayChange = await util
        .promisify(connection.execute)
        .bind(connection)(
        `UPDATE workout_sets
        LEFT JOIN workout_categories as WC ON WC.id=workout_categories_id 
        LEFT JOIN user_workouts as UW ON UW.id = user_workouts_id 
        SET training_name=?, sets=?, times=?, order_index=?, label=?, scheduled_day=?
        WHERE user_workouts_id= ?`,
        [name, sets, times, maxOrderIndex, category, newDay, workoutId]
      );

      return resultUpdateWorkoutWithDayChange;
    } catch (e) {
      throw new Error(e);
    }
  },

  updateWorkout: async ({ workoutId, category, name, sets, times }) => {
    try {
      const resultUpdateWorkout = await util
        .promisify(connection.execute)
        .bind(connection)(`UPDATE workout_sets
      LEFT JOIN workout_categories as WC ON WC.id=workout_categories_id 
      SET training_name='${name}', sets=${sets}, times=${times}, label='${category}'
      WHERE user_workouts_id= ${workoutId};`);

      return resultUpdateWorkout;
    } catch (e) {
      throw new Error(e);
    }
  },

  // updateSchedule: async (newDay, userId) => {
  //   try {
  //     const resultUpdateSchedule = await util
  //       .promisify(connection.execute)
  //       .bind(connection)(`UPDATE user_workouts SET scheduled_day = ${newDay}`);
  //     return createWorkoutSet;
  //   } catch (e) {}
  // },

  getUserScheduleInfo: async (id) => {
    try {
      const getUserScheduleInfo = await util
        .promisify(connection.execute)
        .bind(connection)(
        `SELECT workout_sets.user_workouts_user_id as userId, user_workouts_id ,workout_sets.training_name, workout_sets.sets, workout_sets.times, workout_sets.order_index, workout_categories.label, user_workouts.scheduled_day FROM workout_app_backend.workout_sets 
        LEFT JOIN workout_categories ON workout_categories.id=workout_categories_id 
        LEFT JOIN user_workouts ON user_workouts.id = user_workouts_id 
        WHERE workout_sets.user_workouts_user_id = ${id};`
      );

      return getUserScheduleInfo;
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
