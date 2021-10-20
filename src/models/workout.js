const util = require('util');
const connection = require('../db');

const WorkoutModel = {
  updateWorkoutCategory: async ({ color, userId }) => {
    try {
      await util.promisify(connection.query).bind(connection)(
        `UPDATE workout_categories SET color = 
            CASE category
              WHEN 'Warm Up' THEN '${color.WarmUp}'
              WHEN 'Arms' THEN '${color.Arms}' 
              WHEN 'Legs' THEN '${color.Legs}' 
              WHEN 'Chest' THEN '${color.Chest}'
              WHEN 'Abs' THEN '${color.Abs}' 
              WHEN 'Glutes' THEN '${color.Glutes}' 
              WHEN 'Back' THEN '${color.Back}'
              WHEN 'Shoulders' THEN '${color.Shoulders}' 
              WHEN 'Upper Body' THEN '${color.UpperBody}'
              WHEN 'Lower Body' THEN '${color.LowerBody}'
            END
          WHERE users_id IN (${userId}) and category IN ('Warm Up','Arms','Legs','Chest','Abs','Glutes','Back','Shoulders','Upper Body','Lower Body');`
      );
      return;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutSet: async ({ userId }) => {
    try {
      await util.promisify(connection.query).bind(connection)(
        `INSERT INTO workout_sets (users_id) VALUES(?);`,
        [userId]
      );
      return;
    } catch (e) {
      throw new Error(e);
    }
  },

  createWorkoutItem: async ({ userId, category, name }) => {
    try {
      const categoryId = await util
        .promisify(connection.query)
        .bind(connection)(
        `SELECT workout_categories.id FROM workout_categories WHERE users_id=? and category=?`,
        [userId, category]
      );
      const resultCreateWorkoutItem = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_items (workout_item, workout_categories_id)SELECT * FROM (SELECT ?,?)as tmp WHERE NOT EXISTS (SELECT * FROM workout_items WHERE workout_categories_id=? and workout_item=?);`,
        [name, categoryId[0].id, categoryId[0].id, name]
      );

      return resultCreateWorkoutItem.insertId;
    } catch (e) {
      throw new Error(e);
    }
  },

  createOriginalWorkoutSetItem: async ({ workoutItemId, workoutSetsId }) => {
    try {
      const resultCreateWorkoutSetItem = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_set_items (workout_items_id, workout_sets_id) VALUES(?,?)`,
        [workoutItemId, workoutSetsId]
      );

      return resultCreateWorkoutSetItem;
    } catch (e) {
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

  createNewItems: async ({ workoutItemIdArray, workoutSetId }) => {
    try {
      let createdSetItemIdArray = [];
      let queryVal = [];
      workoutItemIdArray.map((item) => {
        if (item.id === null) {
          queryVal.push(`(${item.workoutItemId}, ${workoutSetId})`);
        }
      });

      queryVal.join(',');
      const createNewSetItems = await util
        .promisify(connection.query)
        .bind(connection)(
        `INSERT INTO workout_set_items (workout_items_id, workout_sets_id) VALUES ${queryVal}`
      );
      let firstInsertedId = createNewSetItems.insertId;
      let j = 0;
      for (let item of workoutItemIdArray) {
        if (item.id === null) {
          item.id = firstInsertedId + j;
          j++;
        }
      }

      return workoutItemIdArray;
    } catch (e) {
      throw new Error(e);
    }
  },
  updateOrder: async ({ newItemSetArray }) => {
    try {
      let queryVal = '';
      let whereVal = [];
      newItemSetArray.map((item) => {
        queryVal += ` WHEN ${item.id} THEN ${item.order} `;
        whereVal.push(item.id);
      });

      await util.promisify(connection.query).bind(connection)(
        `UPDATE workout_set_items SET set_order = 
          CASE id
            ${queryVal}
          END
          WHERE id in (${whereVal.join(',')})`
      );
      return;
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = WorkoutModel;
