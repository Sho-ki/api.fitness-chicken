const LoginModel = require('../models/login');

module.exports = {
  signUp: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await LoginModel.signUp(username, password);

      res.status(201).json({ result });
    } catch (e) {
      res.status(500).json({ errorMessage: 'Duplicate error' });
    }
  },

  signIn: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const result = await LoginModel.signIn(username, password);

      if (result === 'NO USERS FOUND') {
        res.status(400).json({ result });
      } else {
        res.status(200).json({ result });
      }
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
