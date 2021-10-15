const LoginModel = require('../models/login');

module.exports = {
  signUp: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await LoginModel.signUp(email, password);

      res.status(201).json({ result });
    } catch (e) {
      res.status(500).json({ errorMessage: 'Duplicate error' });
    }
  },

  signIn: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await LoginModel.signIn(email, password);

      if (result === 'NO USERS FOUND') {
        res.status(400).json({ errorMessage: 'NO USERS FOUND' });
      } else {
        res.status(200).json({ result });
      }
    } catch (e) {
      res.status(500).send({ e });
    }
  },
};
