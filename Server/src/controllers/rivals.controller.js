const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { rivalsService } = require('../services');

const getRivals = catchAsync(async (req, res) => {
  const userId = req.query.userId || req.user.id;
  const rivals = await rivalsService.listRivals(userId);
  res.send(rivals);
});

const postRival = catchAsync(async (req, res) => {
  const { rivalId } = req.body;
  const result = await rivalsService.toggleRival(rivalId, req.user);
  res.status(httpStatus.CREATED).send(result);
});

const getRivalScores = catchAsync(async (req, res) => {
  const userId = req.query.userId || req.user.id;
  const { mode, songId, diff } = req.params;
  const scores = await rivalsService.getRivalScores(userId, mode, songId, diff);
  res.send(scores);
});

module.exports = { getRivals, postRival, getRivalScores };
