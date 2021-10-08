const UserModel = require("../models/user");

module.exports = {
  getUserScheduleInfo: async (req, res) => {
    try {
      const userId = req.params.id;
      const resultGetUserScheduleInfo = await UserModel.getUserScheduleInfo(
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
      default:
        return (weekSchedule.uncategorized[rgaui.order_index] = rgaui);
    }
  });
  return weekSchedule;
}
