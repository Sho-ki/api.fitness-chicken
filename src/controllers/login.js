const LoginModel = require('../models/login');

module.exports = {
  signUp: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await LoginModel.signUp(username, password);

      res.status(201).json({ status: 200 });
    } catch (e) {
      res.status(500).json({ errorMessage: 'Duplicate error' });
      // res.send({ e });
    }
  },

  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const result = await LoginModel.signIn(username, password);

      res.status(200).json(result);
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
