const util = require('util');
const connection = require('../db');

const WorkoutModel = {
  // createWorkoutSets: async (dayOfWeek, userId) => {
  //   try {
  //     const resultCreateWorkoutSets = await util
  //       .promisify(connection.query)
  //       .bind(connection)(
  //       `INSERT INTO workout_sets (day_of_week, users_id) VALUES(?,?)`,
  //       [dayOfWeek, userId]
  //     );

  //     return resultCreateWorkoutSets.insertId;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // createWorkoutCategory: async (category, userId) => {
  //   try {
  //     const resultCreateWorkoutCategory = await util
  //       .promisify(connection.query)
  //       .bind(connection)(
  //       `INSERT INTO workout_categories (label, user_id)SELECT * FROM (SELECT '${category}', ${userId})as tmp WHERE NOT EXISTS (SELECT * FROM workout_categories WHERE user_id=${userId} and label='${category}');
  //         `
  //     );

  //     if (resultCreateWorkoutCategory.insertId === 0) {
  //       const getExistingCategoryId = await util
  //         .promisify(connection.query)
  //         .bind(connection)(
  //         `SELECT id FROM workout_categories WHERE user_id=${userId} and label='${category}'`
  //       );

  //       return getExistingCategoryId[0].id;
  //     }
  //     return resultCreateWorkoutCategory.insertId;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // createWorkoutSet: async ({
  //   name,
  //   sets,
  //   times,
  //   orderIndex,
  //   workoutCategoryId,
  //   userWorkoutsId,
  //   userId,
  // }) => {
  //   try {
  //     const resultCreateWorkoutSet = await util
  //       .promisify(connection.query)
  //       .bind(connection)(
  //       `INSERT INTO workout_sets(training_name, sets, times, order_index,workout_categories_id, user_workouts_id,user_workouts_user_id) VALUES(?,?,?,?,?,?,?)`,
  //       [
  //         name,
  //         sets,
  //         times,
  //         orderIndex,
  //         workoutCategoryId,
  //         userWorkoutsId,
  //         userId,
  //       ]
  //     );
  //     return resultCreateWorkoutSet;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },
  // updateWorkoutWithDayChange: async ({
  //   newDayOfWeek,
  //   workoutId,
  //   userId,
  //   category,
  //   name,
  //   sets,
  //   times,
  // }) => {
  //   try {
  //     let maxOrderIndex = await util
  //       .promisify(connection.query)
  //       .bind(connection)(
  //       `SELECT max(order_index) as maxOrderIndex FROM workout_sets
  //       LEFT JOIN user_workouts ON user_workouts.id = user_workouts_id
  //       WHERE workout_sets.user_workouts_user_id = ${userId} and scheduled_day="${newDayOfWeek}";`
  //     );
  //     maxOrderIndex = maxOrderIndex[0].maxOrderIndex
  //       ? maxOrderIndex[0].maxOrderIndex + 1
  //       : 0;

  //     const resultUpdateWorkoutWithDayChange = await util
  //       .promisify(connection.query)
  //       .bind(connection)(
  //       `UPDATE workout_sets
  //       LEFT JOIN workout_categories as WC ON WC.id=workout_categories_id
  //       LEFT JOIN user_workouts as UW ON UW.id = user_workouts_id
  //       SET training_name=?, sets=?, times=?, order_index=?, label=?, scheduled_day=?
  //       WHERE user_workouts_id= ?`,
  //       [name, sets, times, maxOrderIndex, category, newDayOfWeek, workoutId]
  //     );

  //     return resultUpdateWorkoutWithDayChange;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // updateWorkout: async ({ workoutId, category, name, sets, times }) => {
  //   try {
  //     const resultUpdateWorkout = await util
  //       .promisify(connection.query)
  //       .bind(connection)(`UPDATE workout_sets
  //     LEFT JOIN workout_categories as WC ON WC.id=workout_categories_id
  //     SET training_name='${name}', sets=${sets}, times=${times}, label='${category}'
  //     WHERE user_workouts_id= ${workoutId};`);

  //     return resultUpdateWorkout;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },
  createWorkoutCategory: async ({ category, color, userId }) => {
    try {
      // insert data if there is no record of the category, else do nothing
      let getCategory = await util.promisify(connection.query).bind(connection)(
        `SELECT * FROM workout_app_db.workout_categories WHERE users_id = ? and category = ?;`,
        [userId, category]
      );
      let isRecordExists = getCategory.length > 0;

      let recordId;
      // if there is a record of the category, update the record
      if (isRecordExists) {
        recordId = getCategory[0].id;
        let existColor = color || getCategory[0].color;

        await util.promisify(connection.query).bind(connection)(
          `UPDATE workout_categories SET color=?  WHERE users_id = ? and category =?;`,
          [existColor, userId, category]
        );

        // insert record if there is no record of the category
      } else {
        let colorSelected = color || 'gray';
        const insert = await util.promisify(connection.query).bind(connection)(
          `INSERT INTO workout_categories (category, color, users_id) VALUES(?, ?, ?);`,
          [category, colorSelected, userId]
        );

        recordId = insert.insertId;
      }

      return recordId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async ({ userId }) => {
    try {
      const resultCreateWorkoutSet = await util
        .promisify(connection.query)
        .bind(connection)(`INSERT INTO workout_sets (users_id) VALUES(?);`, [
        userId,
      ]);
      return resultCreateWorkoutSet.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },
  createWorkoutItem: async ({ name, workoutCategoryId }) => {
    try {
      const resultCreateWorkoutItem = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_items (workout_item,workout_categories_id) VALUES(?,?);`,
        [name, workoutCategoryId]
      );

      return resultCreateWorkoutItem.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSetItem: async ({ workoutItemId, workoutSetsId }) => {
    try {
      const resultCreateWorkoutSetItem = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_set_items (workout_items_id, workout_sets_id) VALUES(?,?)`,
        [workoutItemId, workoutSetsId]
      );

      return resultCreateWorkoutSetItem;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  },

  createWorkoutSetCopy: async ({ dayOfWeek, userId }) => {
    try {
      const resultCreateWorkoutSetCopy = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_sets (day_of_week, users_id) VALUES(?,?)`,
        [dayOfWeek, userId]
      );

      return resultCreateWorkoutSetCopy.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  dragdropWorkout: async ({ workoutSetItemId, workoutSetsId, setOrder }) => {
    try {
      let query1 = `CREATE TEMPORARY TABLE tmp SELECT * FROM workout_set_items WHERE id=${workoutSetItemId};`;
      let query2 = ` UPDATE tmp SET set_order = ${setOrder} , workout_sets_id=${workoutSetsId} WHERE id=${workoutSetItemId}; `;
      let query3 = ' ALTER TABLE tmp drop id;';
      let query4 = ` INSERT INTO workout_set_items SELECT 0,tmp.* FROM tmp;`;
      let query5 = `DROP TABLE tmp;`;

      await util.promisify(connection.query).bind(connection)(query1);
      await util.promisify(connection.query).bind(connection)(query2);
      await util.promisify(connection.query).bind(connection)(query3);
      await util.promisify(connection.query).bind(connection)(query4);
      const resultDragDrop = await util
        .promisify(connection.query)
        .bind(connection)(query5);

      return resultDragDrop;
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = WorkoutModel;
