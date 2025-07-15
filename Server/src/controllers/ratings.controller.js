const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { ratingsService } = require('../services');

const createRating = catchAsync(async (req, res) => {
  await ratingsService.createRating(req.body, req.user);
  const stats = await ratingsService.getRatingStats(req.body.song_id, req.body.diff);
  res.status(httpStatus.CREATED).send(stats);
});

const getRating = catchAsync(async (req, res) => {
  const { songId, diff } = req.params;
  const stats = await ratingsService.getRatingStats(songId, diff);
  res.send(stats);
});

module.exports = { createRating, getRating };
