const express = require('express');
const leaderboardController = require('../../controllers/leaderboard.controller');

const router = express.Router();

router.route('/').get(leaderboardController.getFullLeaderboard);
router.route('/:mode').get(leaderboardController.getLeaderboard);

module.exports = router;
