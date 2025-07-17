const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { goalsService } = require('../services');

const getGoals = catchAsync(async (req, res) => {
  const mode = req.params.mode;
  const userId = req.query.userId || req.user.id;
  const goals = await goalsService.getGoals(mode, userId);
  res.send(goals);
});

const postGoal = catchAsync(async (req, res) => {
  const mode = req.params.mode;
  const result = await goalsService.toggleGoal(req.body, mode, req.user);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = { getGoals, postGoal };
