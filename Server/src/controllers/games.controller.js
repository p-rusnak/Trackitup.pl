const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gamesService } = require('../services');

const getGame = catchAsync(async (req, res) => {
    const result = await gamesService.getGame(req.params.gameId);
    res.send(result);
});

const getGames = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await gamesService.getGames(filter, options);
    res.send(result);
});

const postGame = catchAsync(async (req, res) => {
    const game = await gamesService.createGame(req.body, req.user);
    res.status(httpStatus.CREATED).send(game);
});

const getCollection = catchAsync(async (req, res) => {
    const user = {userId: req.user.id}
    const filter = pick(user, ['userId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await gamesService.getCollection(filter, options);
    res.send(result);
});

const getRating = catchAsync(async(req, res) => {
    const rating = await gamesService.getRating(req.params.gameId, req.params.userId)
    res.send(rating)
})

const getOwnRating = catchAsync(async (req, res) => {
    const rating = await gamesService.getRating(req.params.gameId, req.user.id)
    res.send(rating)
})

const rateGame = catchAsync(async (req, res) => {
    const rating = await gamesService.createRating(req.params.gameId, req.body, req.user);
    res.status(httpStatus.CREATED).send(rating)
})


module.exports = {
    getGame,
    getGames,
    getCollection,
    postGame,
    getRating,
    getOwnRating,
    rateGame,
};
