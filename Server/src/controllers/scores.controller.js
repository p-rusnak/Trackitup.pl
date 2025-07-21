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

const getDailyScores = catchAsync(async (req, res) => {
    const userId = req.query.userId || req.user?.id;
    const { from, to, tzOffset } = req.query;
    if (!userId) {
        res.status(httpStatus.BAD_REQUEST).send({ message: 'userId is required' });
        return;
    }
    const data = await scoresService.getDailyScores(userId, from, to, parseInt(tzOffset, 10) || 0);
    res.send(data);
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

const updateScore = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updated = await scoresService.updateScore(id, req.user.id, req.body.comment ?? null);
    if (!updated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Score not found');
    }
    res.send(updated);
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

const exportScores = catchAsync(async (req, res) => {
    const userId = req.query.userId || req.user.id;
    const scores = await scoresService.getAllScores(1, 1000000, { player: undefined, songId: undefined, diff: undefined, grade: undefined, from: undefined, to: undefined, mode: undefined, userId }, 'createdAt:asc');
    const lines = ['date,song,diff,mode,grade,miss_count,is_new_clear,is_fail,notes'];
    scores.results.forEach((s) => {
        const fail = s.grade === 'Failed' || s.grade === 'F';
        lines.push([
            s.createdAt.toISOString(),
            s.song_id,
            s.diff,
            s.mode,
            s.grade || '',
            s.misses ?? '',
            s.firstPass ? 'true' : 'false',
            fail ? 'true' : 'false',
            s.comment ? s.comment.replace(/\n/g, ' ') : ''
        ].join(','));
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('scores.csv');
    res.send(lines.join('\n'));
});

const exportSession = catchAsync(async (req, res) => {
    const session = await sessionService.getSession(req.params.id);
    if (!session) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
    }
    const lines = ['date,song,diff,mode,grade,miss_count,is_new_clear,is_fail,notes'];
    session.scores.forEach((s) => {
        const fail = s.grade === 'Failed' || s.grade === 'F';
        lines.push([
            s.createdAt.toISOString(),
            s.song_id,
            s.diff,
            s.mode,
            s.grade || '',
            s.misses ?? '',
            s.firstPass ? 'true' : 'false',
            fail ? 'true' : 'false',
            s.comment ? s.comment.replace(/\n/g, ' ') : ''
        ].join(','));
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('session.csv');
    res.send(lines.join('\n'));
});

module.exports = {
    getScores,
    getScoreHistory,
    getBestScore,
    postScore,
    deleteScore,
    updateScore,
    getLatestScores,
    getLatestPlayers,
    getAllScores,
    getDailyScores,
    exportScores,
    exportSession,
};
