const LoginModel = require('../models/login');

module.exports = {
  signUp: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      await LoginModel.signUp(email, password);

      res.status(201).json({ message: 'Successfully created' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  signIn: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await LoginModel.signIn(email, password);

      res.status(200).json({ message: 'Sign in successfully', result });
    } catch (e) {
      res.status(500).send({ message: 'Wrong email or password' });
    }
  },
};
