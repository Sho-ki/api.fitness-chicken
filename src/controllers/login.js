const LoginModel = require('../models/login');
const WorkoutModel = require('../models/workout');

module.exports = {
  signUp: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const userId = await LoginModel.signUp(email, password);

      await LoginModel.createWorkoutCategory({ userId });

      await LoginModel.createWorkoutSet({ userId });

      res.status(201).json({ message: 'Successfully created' });
    } catch (e) {
      res.status(500).json({ message: e });
    }
  },

  signIn: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const result = await LoginModel.signIn(email, password);

      res.status(200).json({ message: 'Sign in successfully', id: result.id });
    } catch (e) {
      res.status(500).send({ message: 'Wrong email or password' });
    }
  },
};
