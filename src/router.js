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

router.post('/api/workouts', workoutController.createWorkout);

router.put('/api/workouts/:workoutId', workoutController.updateWorkout);

router.get('/api/workouts/:userId', userController.getUserScheduleInfo);

// router.get("/quiz-api/:id", controller.getQuiz);

// router.put("/quiz-api/:id", controller.updateQuiz);

// router.delete("/quiz-api/:id", controller.deleteQuiz);

// router.get("/active-quiz-api", controller.listActiveQuizes);

// router.post("/candidate-api", controller.createCandidate);

// router.post("/candidate-answer-api", controller.createCandidateAnswer);

// router.get("/candidate-api", controller.listCandidates);

// router.delete("/candidate-api/:id", controller.deleteCandidate);

// router.get("/candidate-api/:id", controller.getCandidate);

module.exports = router;
