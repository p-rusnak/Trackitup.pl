const express = require('express');
const auth = require('../../middlewares/auth');
const leaderboardController = require('../../controllers/leaderboard.controller');

const router = express.Router();

router.route('/').get(auth('getScores'), leaderboardController.getFullLeaderboard);
router.route('/:mode').get(auth('getScores'), leaderboardController.getLeaderboard);

module.exports = router;
