const WorkoutModel = require("./model");

module.exports = {
  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await WorkoutModel.signIn(username, password);
      console.log(result);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
