const catchAsync = require('../utils/catchAsync');
const { leaderboardService } = require('../services');

const getLeaderboard = catchAsync(async (req, res) => {
  const mode = req.params.mode;
  const board = await leaderboardService.getLeaderboard(mode);
  res.send(board);
});

module.exports = { getLeaderboard };
