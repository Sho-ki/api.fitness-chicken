const util = require("util");
const connection = require("../db");

const WorkoutModel = {
  createUserWorkouts: async (dayOfWeek, userId) => {
    try {
      let queryState;
      if (dayOfWeek !== null) {
        queryState = `INSERT INTO user_workouts (scheduled_day, user_id) VALUES('${dayOfWeek}', '${userId}')`;
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
    newDayOfWeek,
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
        WHERE workout_sets.user_workouts_user_id = ${userId} and scheduled_day="${newDayOfWeek}";`
      );
      maxOrderIndex = maxOrderIndex[0].maxOrderIndex
        ? maxOrderIndex[0].maxOrderIndex + 1
        : 0;

      const resultUpdateWorkoutWithDayChange = await util
        .promisify(connection.execute)
        .bind(connection)(
        `UPDATE workout_sets
        LEFT JOIN workout_categories as WC ON WC.id=workout_categories_id 
        LEFT JOIN user_workouts as UW ON UW.id = user_workouts_id 
        SET training_name=?, sets=?, times=?, order_index=?, label=?, scheduled_day=?
        WHERE user_workouts_id= ?`,
        [name, sets, times, maxOrderIndex, category, newDayOfWeek, workoutId]
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
};

module.exports = WorkoutModel;
