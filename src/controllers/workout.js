const connection = require('../db');
const WorkoutModel = require('../models/workout');

module.exports = {
  // /api/category/:userId
  updateWorkoutCategory: async (req, res) => {
    try {
      const userId = req.params.userId;
      const color = req.body.color;

      await WorkoutModel.updateWorkoutCategory({
        color,
        userId,
      });

      res.status(201).json({ message: 'Successfully category updated' });
      return;
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  // /api/workout-items/:userId
  createWorkoutItem: async (req, res) => {
    try {
      const userId = req.params.userId;
      const category = req.body.category;
      const name = req.body.name;

      const workoutItemId = await WorkoutModel.createWorkoutItem({
        userId,
        category,
        name,
      });

      if (workoutItemId === 0) {
        res.status(200).json({ message: 'The workout item already exists' });
        return;
      }

      res.status(201).json({ message: 'Successfully workout item created' });
      return;
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  // /api/workout-set/:workoutSetId
  saveWorkoutSet: async (req, res) => {
    try {
      const workoutSetId = req.params.workoutSetId;
      // = { "id": null, "workoutItemId": 12, "order": 1 },
      // { "id": 43, "workoutItemId": 13, "order": 2 },
      // { "id": null, "workoutItemId": 13, "order": 3 },
      // { "id": null, "workoutItemId": 12, "order": 4 }
      const workoutItemIdArray = req.body.workoutItemIdArray;

      let newItemSetArray = await WorkoutModel.createNewItems({
        workoutItemIdArray,
        workoutSetId,
      });

      await WorkoutModel.updateOrder({
        newItemSetArray,
      });

      res.status(200).json({ message: 'Successfully save the change' });
      return;
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
