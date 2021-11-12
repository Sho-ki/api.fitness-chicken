const express = require('express');
const bodyParser = require('body-parser');
const loginController = require('./controllers/login');
const workoutController = require('./controllers/workout');
const userController = require('./controllers/user');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());
router.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// parsing the incoming data

// HTTP Methods
router.post('/signUp', loginController.signUp);
router.post('/signIn', loginController.signIn);
router.get('/api/categories/:userId', workoutController.getWorkoutCategory);
router.put('/api/categories/:userId', workoutController.updateWorkoutCategory);
router.get('/api/workout-items/:userId', workoutController.getWorkoutItem);
router.post('/api/workout-items/:userId', workoutController.createWorkoutItem);
router.put('/api/workout-items/:userId/:workoutItemId', workoutController.updateWorkoutItem);
router.delete('/api/workout-items/:workoutItemId', workoutController.deletewWorkoutItem);
router.put('/api/workout-sets/:workoutSetId', workoutController.saveWorkoutSet);
router.get('/api/workouts/:userId', userController.getUserScheduleInfo);

module.exports = router;
