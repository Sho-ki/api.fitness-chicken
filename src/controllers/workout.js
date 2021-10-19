const connection = require('../db');
const WorkoutModel = require('../models/workout');

module.exports = {
  // createWorkout: async (req, res) => {
  //   try {
  //     const dayOfWeek = req.body.dayOfWeek || null;
  //     const userId = req.body.id;
  //     const category = req.body.category;
  //     const name = req.body.name;
  //     const sets = req.body.sets;
  //     const times = req.body.times;
  //     const orderIndex = req.body.orderIndex;

  //     const workoutSetsId = await WorkoutModel.createWorkoutSets(
  //       dayOfWeek,
  //       userId
  //     );

  //     const workoutCategoryId = await WorkoutModel.createWorkoutCategory(
  //       category,
  //       userId
  //     );

  //     const resultWorkoutSet = await WorkoutModel.createWorkoutSet({
  //       name,
  //       sets,
  //       times,
  //       orderIndex,
  //       workoutCategoryId,
  //       workoutSetsId,
  //       userId,
  //     });

  //     res.status(200).json({ resultWorkoutSet });
  //     return;
  //   } catch (e) {
  //     res.status(500).send({ e });
  //   }
  // },

  // updateWorkout: async (req, res) => {
  //   try {
  //     const newDayOfWeek = req.body.newDayOfWeek || null;
  //     const workoutId = req.params.workoutId;
  //     const userId = req.body.id;
  //     const category = req.body.category;
  //     const name = req.body.name;
  //     const sets = req.body.sets;
  //     const times = req.body.times;
  //     const isDayChanged = req.body.isDayChanged;

  //     if (isDayChanged) {
  //       const resultUpdateWorkoutWithDayChange =
  //         await WorkoutModel.updateWorkoutWithDayChange({
  //           newDayOfWeek,
  //           workoutId,
  //           userId,
  //           category,
  //           name,
  //           sets,
  //           times,
  //         });
  //       return res.status(200).json({ resultUpdateWorkoutWithDayChange });
  //     } else {
  //       const resultUpdateWorkout = await WorkoutModel.updateWorkout({
  //         workoutId,
  //         category,
  //         name,
  //         sets,
  //         times,
  //       });
  //       return res.status(200).json({ resultUpdateWorkout });
  //     }
  //   } catch (e) {
  //     res.status(500).send({ e });
  //   }
  // },

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

  // /api/workout/
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
      await WorkoutModel.createWorkoutSet({ userId });

      // const resultWorkoutSetItem =
      //   await WorkoutModel.createOriginalWorkoutSetItem({
      //     workoutItemId,
      //     workoutSetsId,
      //   });

      res.status(201).json({ message: 'Successfully workout item created' });
      return;
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  dragdropWorkout: async (req, res) => {
    try {
      const workoutSetItemId = req.params.workoutSetItemId;
      const userId = req.body.userId;
      const dayOfWeek = req.body.dayOfWeek;
      const setOrder = req.body.order;

      const workoutSetsId = await WorkoutModel.createWorkoutSetCopy({
        dayOfWeek,
        userId,
      });

      const resultCopyWorkoutSetItem = await WorkoutModel.dragdropWorkout({
        workoutSetItemId,
        workoutSetsId,
        setOrder,
      });

      return res.status(200).json({ resultCopyWorkoutSetItem });
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
