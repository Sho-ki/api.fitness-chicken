const UserModel = require('../models/user');

module.exports = {
  getUserScheduleInfo: async (req, res) => {
    try {
      const userId = req.params.userId;
      const resultGetUserScheduleInfo = await UserModel.getUserScheduleInfo(
        userId
      );

      res.status(200).json(resultGetUserScheduleInfo);
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
