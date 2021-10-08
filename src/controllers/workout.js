const WorkoutModel = require("../models/workout");

module.exports = {
  createWorkout: async (req, res) => {
    try {
      const dayOfWeek = req.body.dayOfWeek || null;
      const userId = req.body.id;
      const category = req.body.category;
      const name = req.body.name;
      const sets = req.body.sets;
      const times = req.body.times;
      const orderIndex = req.body.orderIndex;

      const userWorkoutsId = await WorkoutModel.createUserWorkouts(
        dayOfWeek,
        userId
      );

      const workoutCategoryId = await WorkoutModel.createWorkoutCategory(
        category,
        userId
      );

      const resultWorkoutSet = await WorkoutModel.createWorkoutSet({
        name,
        sets,
        times,
        orderIndex,
        workoutCategoryId,
        userWorkoutsId,
        userId,
      });

      res.status(200).json(resultWorkoutSet);
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  updateWorkout: async (req, res) => {
    try {
      const newDayOfWeek = req.body.newDayOfWeek || null;
      const workoutId = req.params.workoutId;
      const userId = req.body.id;
      const category = req.body.category;
      const name = req.body.name;
      const sets = req.body.sets;
      const times = req.body.times;
      const isDayChanged = req.body.isDayChanged;

      if (isDayChanged) {
        const resultUpdateWorkoutWithDayChange =
          await WorkoutModel.updateWorkoutWithDayChange({
            newDayOfWeek,
            workoutId,
            userId,
            category,
            name,
            sets,
            times,
          });
        return res.status(200).json(resultUpdateWorkoutWithDayChange);
      } else {
        const resultUpdateWorkout = await WorkoutModel.updateWorkout({
          workoutId,
          category,
          name,
          sets,
          times,
        });
        return res.status(200).json(resultUpdateWorkout);
      }
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
