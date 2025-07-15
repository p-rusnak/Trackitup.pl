const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const goalsValidation = require('../../validations/goals.validation');
const goalsController = require('../../controllers/goals.controller');

const router = express.Router();

router
  .route('/:mode')
  .get(auth('getScores'), goalsController.getGoals)
  .post(auth('postScores'), validate(goalsValidation.postGoal), goalsController.postGoal);

module.exports = router;
