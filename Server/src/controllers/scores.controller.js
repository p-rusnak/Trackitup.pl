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

const getScoreHistory = catchAsync(async (req, res) => {
    const mode = req.params.mode;
    const { songId, diff } = req.params;
    const userId = req.query.userId || req.user.id;
    const history = await scoresService.getScoreHistory(userId, mode, songId, diff);
    res.send(history);
});

const getBestScore = catchAsync(async (req, res) => {
    const mode = req.params.mode;
    const { songId, diff } = req.params;
    const score = await scoresService.getBestScore(mode, songId, diff);
    res.send(score);
});

const postScore = catchAsync(async (req, res) => {
    const result = await scoresService.createScore(req.body, req.params.mode, req.user);
    res.status(httpStatus.CREATED).send(result);
});

const deleteScore = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const removed = await scoresService.deleteScore(id, req.user.id);
    if (!removed) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Score not found');
    }
    res.status(httpStatus.NO_CONTENT).send();
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

const getAllScores = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const sortBy = req.query.sortBy;
    const filters = pick(req.query, [
        'player',
        'songId',
        'diff',
        'grade',
        'from',
        'to',
        'mode',
    ]);
    const result = await scoresService.getAllScores(page, limit, filters, sortBy);
    res.send(result);
});

module.exports = {
    getScores,
    getScoreHistory,
    getBestScore,
    postScore,
    deleteScore,
    getLatestScores,
    getLatestPlayers,
    getAllScores,
};
