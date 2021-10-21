const util = require('util');
const connection = require('../db');

const UserModel = {
  getUserScheduleInfo: async (id) => {
    try {
      const getUserScheduleInfo = await util
        .promisify(connection.query)
        .bind(connection)(
        `SELECT ws.*, wsi.set_order, wsi.reps, wsi.sets, wi.workout_item, wc.category, wc.color 
          FROM workout_sets as ws 
          LEFT JOIN workout_set_items as wsi ON wsi.workout_sets_id = ws.id 
          LEFT JOIN workout_items as wi ON wi.id = wsi.workout_items_id 
          LEFT JOIN workout_categories as wc ON wc.id = wi.workout_categories_id 
          WHERE ws.users_id = ${id}`
      );

      return getUserScheduleInfo;
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = UserModel;
