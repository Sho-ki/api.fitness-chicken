const util = require('util');
const connection = require('../db');

const UserModel = {
  getUserScheduleInfo: async (id) => {
    try {
      const getUserScheduleInfo = await util
        .promisify(connection.query)
        .bind(connection)(
        `SELECT workout_sets.user_workouts_user_id as userId, user_workouts_id ,workout_sets.training_name, workout_sets.sets, workout_sets.times, workout_sets.order_index, workout_categories.label, user_workouts.scheduled_day 
            FROM workout_app_backend.workout_sets 
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

module.exports = UserModel;
