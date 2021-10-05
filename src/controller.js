const WorkoutModel = require("./model");

module.exports = {
  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await WorkoutModel.signIn(username, password);

      res.status(201).json(result);
    } catch (e) {
      res.status(500).send(e);
    }
  },

  login: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await WorkoutModel.login(username, password);

      res.status(200).json(result);
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
