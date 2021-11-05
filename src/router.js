const express = require('express');
const bodyParser = require('body-parser');
const loginController = require('./controllers/login');
const workoutController = require('./controllers/workout');
const userController = require('./controllers/user');

const cors = require('cors');

const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.use(cors());

// HTTP Methods

router.post('/signUp', loginController.signUp);

router.post('/signIn', loginController.signIn);

router.put('/api/categories/:userId', workoutController.updateWorkoutCategory);

router.get('/api/workout-items/:userId', workoutController.getWorkoutItem);

router.post('/api/workout-items/:userId', workoutController.createWorkoutItem);

router.put('/api/workout-items/:userId/:workoutItemId', workoutController.updateWorkoutItem);

router.delete('/api/workout-items/:workoutItemId', workoutController.deletewWorkoutItem);

router.put('/api/workout-sets/:workoutSetId', workoutController.saveWorkoutSet);

router.get('/api/workouts/:userId', userController.getUserScheduleInfo);

module.exports = router;
