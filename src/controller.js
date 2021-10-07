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

  updateSchedule: async (req, res) => {
    const newDay = req.body.day ? req.body.day : null;
    const userId = req.body.id;

    const result = await WorkoutModel.updateSchedule(newDay, userId);
  },

  getAllUserInfo: async (req, res) => {
    try {
      const userId = req.params.id;
      const resultGetAllUserInfo = await WorkoutModel.getAllUserInfo(userId);

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

      weekSchedule = createHisSchedule(resultGetAllUserInfo, weekSchedule);
      res.status(200).json(weekSchedule);
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};

function createHisSchedule(resultGetAllUserInfo, weekSchedule) {
  resultGetAllUserInfo.map((el) => {
    if (el.scheduled_day === "Sun") {
      const elOrderNum = el.order_index;
      weekSchedule.Sun[elOrderNum] = el;
    }
    if (el.scheduled_day === "Mon") {
      const elOrderNum = el.order_index;
      weekSchedule.Mon[elOrderNum] = el;
    }
    if (el.scheduled_day === "Tue") {
      const elOrderNum = el.order_index;
      weekSchedule.Tue[elOrderNum] = el;
    }
    if (el.scheduled_day === "Wed") {
      const elOrderNum = el.order_index;
      weekSchedule.Wed[elOrderNum] = el;
    }
    if (el.scheduled_day === "Thu") {
      const elOrderNum = el.order_index;
      weekSchedule.Thu[elOrderNum] = el;
    }
    if (el.scheduled_day === "Fri") {
      const elOrderNum = el.order_index;
      weekSchedule.Fri[elOrderNum] = el;
    }
    if (el.scheduled_day === "Sat") {
      const elOrderNum = el.order_index;
      weekSchedule.Sat[elOrderNum] = el;
    }
    if (el.scheduled_day === null) {
      const elOrderNum = el.order_index;
      weekSchedule.uncategorized[elOrderNum] = el;
    }
  });
  return weekSchedule;
}
