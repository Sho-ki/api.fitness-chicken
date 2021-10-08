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
      const orderIndex = req.body.orderIndex;

      const userWorkoutsId = await WorkoutModel.createUserWorkouts(day, userId);

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
      const newDay = req.body.day ? req.body.day : null;
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
            newDay,
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

  getUserScheduleInfo: async (req, res) => {
    try {
      const userId = req.params.id;
      const resultGetUserScheduleInfo = await WorkoutModel.getUserScheduleInfo(
        userId
      );

      let weekSchedule = {
        Sun: {},
        Mon: {},
        Tue: {},
        Wed: {},
        Thu: {},
        Fri: {},
        Sat: {},
        uncategorized: {},
      };

      weekSchedule = createSchedule(resultGetUserScheduleInfo, weekSchedule);
      res.status(200).json(weekSchedule);
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};

function createSchedule(resultGetAllUserInfo, weekSchedule) {
  resultGetAllUserInfo.map((rgaui) => {
    switch (rgaui.scheduled_day) {
      case "Sun":
        return (weekSchedule.Sun[rgaui.order_index] = rgaui);
      case "Mon":
        return (weekSchedule.Mon[rgaui.order_index] = rgaui);
      case "Tue":
        return (weekSchedule.Tue[rgaui.order_index] = rgaui);
      case "Wed":
        return (weekSchedule.Wed[rgaui.order_index] = rgaui);
      case "Thu":
        return (weekSchedule.Thu[rgaui.order_index] = rgaui);
      case "Fri":
        return (weekSchedule.Fri[rgaui.order_index] = rgaui);
      case "Sat":
        return (weekSchedule.Sat[rgaui.order_index] = rgaui);
      case null:
        return (weekSchedule.uncategorized[rgaui.order_index] = rgaui);
    }
  });
  return weekSchedule;
}
