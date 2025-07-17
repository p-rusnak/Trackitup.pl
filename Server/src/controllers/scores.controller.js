const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { scoresService } = require('../services');

const getScores = catchAsync(async (req, res) => {
    const mode = req.params.mode
    const userId = req.query.userId || req.user.id
    const filter = { userId }
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await scoresService.getScores({ ...filter, mode }, options);
    res.send(result);
});

const postScore = catchAsync(async (req, res) => {
    const result = await scoresService.createScore(req.body, req.params.mode, req.user);
    res.status(httpStatus.CREATED).send(result);
});

const getLatestScores = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await scoresService.getLatestScores(limit);
    res.send(result);
});

const getLatestPlayers = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await scoresService.getLatestPlayers(limit);
    res.send(result);
});

module.exports = {
    getScores,
    postScore,
    getLatestScores,
    getLatestPlayers,
};
