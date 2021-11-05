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
      res.status(500).send({ message: e });
    }
  },

  // /api/workout-items/:userId
  createWorkoutItem: async (req, res) => {
    try {
      const userId = req.params.userId;
      const category = req.body.category;
      const name = req.body.name;

      if (!category || !name) {
        res.status(200).json({ message: 'Please fill out the blank' });
        return;
      }
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
      res.status(500).send({ message: e });
    }
  },

  // /api/workout-sets/:workoutSetId
  saveWorkoutSet: async (req, res) => {
    try {
      const workoutSetId = req.params.workoutSetId;
      // = { "id": null, "workoutItemId": 12, "order": 1, reps:10, sets:2 },
      // { "id": 43, "workoutItemId": 13, "order": 2 , reps:10, sets:2},
      // { "id": null, "workoutItemId": 13, "order": 3 , reps:10, sets:2},
      // { "id": null, "workoutItemId": 12, "order": 4 , reps:10, sets:2}
      const workoutItemIdArray = req.body.workoutItemIdArray;
      const deleteIdList = req.body.deleteIdList;

      if (deleteIdList.length > 0) {
        await WorkoutModel.deleteSetItems({
          deleteIdList,
        });
      }

      await WorkoutModel.updateSetItems({
        workoutItemIdArray,
        workoutSetId,
      });

      res.status(200).json({ message: 'Successfully save the change' });
      return;
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },

  // /api/workout-items/:userId/:workoutItemId
  updateWorkoutItem: async (req, res) => {
    try {
      const userId = req.params.userId;
      const workoutItemId = req.params.workoutItemId;
      const category = req.body.category;
      const name = req.body.name;

      const isValidUpdate = await WorkoutModel.updateWorkoutItem({
        userId,
        workoutItemId,
        category,
        name,
      });

      if (!isValidUpdate) {
        res.status(200).json({ message: 'The workout item already exists' });
        return;
      }

      res.status(201).json({ message: 'Successfully workout item updated' });
      return;
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },

  deletewWorkoutItem: async (req, res) => {
    const workoutItemId = req.params.workoutItemId;
    try {
      await WorkoutModel.deleteWorkoutItem({ workoutItemId });
      res.status(201).json({ message: 'Successfuly the workout item deleted' });
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },

  getWorkoutItem: async (req, res) => {
    const userId = req.params.userId;
    try {
      const data = await WorkoutModel.getUserWorkoutItems({ userId });
      res.status(201).json(data);
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },
};
