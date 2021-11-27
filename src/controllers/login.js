const LoginModel = require('../models/login');

module.exports = {
  signUp: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userId = await LoginModel.signUp(email, password);
      if (!userId) {
        res.status(403).json({ message: 'User Already Exists' });
      }
      await LoginModel.createWorkoutCategory({ userId });
      await LoginModel.createWorkoutSet({ userId });
      res.status(201).json({ message: 'Successfully created', userId });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  },

  signIn: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const result = await LoginModel.signIn(email, password);
      if (!result) {
        res.status(403).send({ message: 'Wrong email or password' });
      }
      res.status(200).json({ message: 'Sign in successfully', id: result.id });
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },
};
