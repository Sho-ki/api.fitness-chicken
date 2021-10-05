const WorkoutModel = require("./model");

module.exports = {
  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await WorkoutModel.signIn(username, password);

      res.status(201).json(result);
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  login: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await WorkoutModel.login(username, password);

      res.status(200).json(result);
    } catch (e) {
      res.status(500).send({ e });
    }
  },

  createWorkout: async (req, res) => {
    try {
      const day = req.body.day ? req.body.day : null;
      const userId = req.body.id;
      const category = req.body.category;
      const name = req.body.name;
      const sets = req.body.sets;
      const times = req.body.times;
      const userWorkoutsId = await WorkoutModel.createUserWorkouts(day, userId);

      const workoutCategoryId = await WorkoutModel.createWorkoutCategory(
        category
      );

      const workoutSetResult = await WorkoutModel.createWorkoutSet(
        name,
        sets,
        times,
        userWorkoutsId,
        workoutCategoryId,
        userId
      );

      res.status(200).json(workoutSetResult);
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
